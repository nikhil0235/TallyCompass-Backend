

const Customer = require('../models/Customer');
const Feedback = require('../models/Feedback');
const VOC = require('../models/VOC');
const Product = require('../models/Product');
const CustomerRequest = require('../models/CustomerRequest');
const Feature = require('../models/Feature');
const FormResponse = require('../models/FormResponse');

const dashboardController = {
  async getDashboardStats(req, res) {
    try {
      // --- Key Metrics ---
      const [
        totalCustomers,
        activeVOCProjects,
        averageCustomerRating,
        pendingRequests,
        formResponseCount
      ] = await Promise.all([
        Customer.countDocuments(),
        VOC.countDocuments({ status: 'Ongoing' }),
        Feedback.aggregate([{ $group: { _id: null, avg: { $avg: '$rating' } } }]).then(r => r[0]?.avg || 0),
        CustomerRequest.countDocuments({ 'action.status': 'pending' }),
        FormResponse.countDocuments()
      ]);

      // --- Customer Analytics ---
      const [
        customerStatusAgg,
        proficiencyAgg,
        businessTypeAgg,
        planTypeAgg,
        locationAgg,
        growthAgg
      ] = await Promise.all([
        Customer.aggregate([{ $group: { _id: '$accountStatus', count: { $sum: 1 } } }]),
        Customer.aggregate([{ $group: { _id: '$customerProficiency', count: { $sum: 1 } } }]),
        Customer.aggregate([{ $group: { _id: '$businessType', count: { $sum: 1 } } }]),
        Customer.aggregate([{ $group: { _id: '$planType', count: { $sum: 1 } } }]),
        Customer.aggregate([{ $group: { _id: '$location.state', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 5 }]),
        Customer.aggregate([
          { $project: { createdAt: 1 } },
          { $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' }
            },
            count: { $sum: 1 }
          } },
          { $sort: { '_id.year': -1, '_id.month': -1 } },
          { $limit: 2 }
        ])
      ]);
      const customerStatus = {
        active: customerStatusAgg.find(s => s._id === 'active')?.count || 0,
        inactive: customerStatusAgg.find(s => s._id === 'inactive')?.count || 0,
      };
      const proficiencyLevels = {
        beginner: proficiencyAgg.find(s => s._id === 'beginner')?.count || 0,
        intermediate: proficiencyAgg.find(s => s._id === 'intermediate')?.count || 0,
        advanced: proficiencyAgg.find(s => s._id === 'advanced')?.count || 0,
      };
      const businessTypes = businessTypeAgg.map(b => ({ type: b._id, count: b.count }));
      const planTypes = planTypeAgg.map(p => ({ plan: p._id, count: p.count }));
      const topLocations = locationAgg.map(l => ({ location: l._id, count: l.count }));
      const customerGrowth = {
        currentMonth: growthAgg[0]?.count || 0,
        previousMonth: growthAgg[1]?.count || 0,
      };

      // --- VOC Project Insights ---
      const vocStatusAgg = await VOC.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
      const vocProjectStatus = {
        upcoming: vocStatusAgg.find(s => s._id === 'Upcoming')?.count || 0,
        ongoing: vocStatusAgg.find(s => s._id === 'Ongoing')?.count || 0,
        completed: vocStatusAgg.find(s => s._id === 'Completed')?.count || 0,
        cancelled: vocStatusAgg.find(s => s._id === 'Cancelled')?.count || 0,
      };
      const completedVOCs = await VOC.find({ status: 'Completed', vocStartDate: { $exists: true }, vocEndDate: { $exists: true } });
      const vocCompletionRate = (completedVOCs.length / (vocStatusAgg.reduce((a, b) => a + b.count, 0) || 1)) * 100;
      // Removed activeVOCCount (duplicate)
      const avgVOCDurationDays = completedVOCs.length > 0 ?
        (completedVOCs.reduce((sum, voc) => sum + ((voc.vocEndDate - voc.vocStartDate) / (1000 * 60 * 60 * 24)), 0) / completedVOCs.length) : 0;
      // Top participating customers
      const topParticipatingAgg = await VOC.aggregate([
        { $unwind: '$customerDetailsObj.customerID' },
        { $group: { _id: '$customerDetailsObj.customerID', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]);
      const topParticipatingCustomers = topParticipatingAgg.map(c => ({ customerId: c._id, count: c.count }));

      // --- Feedback Overview ---
      const feedbacks = await Feedback.find();
      const overallRating = feedbacks.length > 0 ? (feedbacks.reduce((sum, f) => sum + (f.rating || 0), 0) / feedbacks.length) : 0;
      const ratingDistribution = feedbacks.reduce((dist, f) => {
        const r = f.rating || 0;
        if (r >= 1 && r <= 5) dist[r] = (dist[r] || 0) + 1;
        return dist;
      }, { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const feedbackVolumeThisMonth = await Feedback.countDocuments({ createdAt: { $gte: startOfMonth } });
      const feedbackVolumePrevMonth = await Feedback.countDocuments({ createdAt: { $gte: startOfPrevMonth, $lt: startOfMonth } });
      const feedbackChannelsAgg = await Feedback.aggregate([{ $group: { _id: '$medium', count: { $sum: 1 } } }]);
      const feedbackChannels = feedbackChannelsAgg.reduce((obj, f) => { obj[f._id] = f.count; return obj; }, {});
      const feedbackTrend = {
        currentMonth: feedbackVolumeThisMonth,
        previousMonth: feedbackVolumePrevMonth,
      };

      // --- Customer Requests ---
      const requestStatusAgg = await CustomerRequest.aggregate([{ $group: { _id: '$action.status', count: { $sum: 1 } } }]);
      const requestStatus = {
        open: requestStatusAgg.find(s => s._id === 'pending')?.count || 0,
        closed: requestStatusAgg.find(s => s._id === 'resolved')?.count || 0,
        inProgress: requestStatusAgg.find(s => s._id === 'review')?.count || 0,
      };
      const requestTypesAgg = await CustomerRequest.aggregate([{ $group: { _id: '$requestType', count: { $sum: 1 } } }]);
      const requestTypes = requestTypesAgg.reduce((obj, r) => { obj[r._id] = r.count; return obj; }, {});
      const avgRequestResolutionDaysAgg = await CustomerRequest.aggregate([
        { $match: { 'action.status': 'resolved', updatedAt: { $exists: true }, createdAt: { $exists: true } } },
        { $project: { diff: { $divide: [{ $subtract: ['$updatedAt', '$createdAt'] }, 1000 * 60 * 60 * 24] } } },
        { $group: { _id: null, avg: { $avg: '$diff' } } }
      ]);
      const avgRequestResolutionDays = avgRequestResolutionDaysAgg[0]?.avg || 0;
      const requestPriorityAgg = await CustomerRequest.aggregate([{ $group: { _id: '$priority', count: { $sum: 1 } } }]);
      const requestPriorityDistribution = requestPriorityAgg.reduce((obj, r) => { obj[r._id] = r.count; return obj; }, {});
      const topRequestedFeaturesAgg = await CustomerRequest.aggregate([
        { $group: { _id: '$featureName', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]);
      const topRequestedFeatures = topRequestedFeaturesAgg.map(f => ({ featureName: f._id, count: f.count }));

      // --- Product Performance ---
      const productUsageAgg = await Customer.aggregate([
        { $group: { _id: '$currentProductID', customerCount: { $sum: 1 } } },
        { $lookup: { from: 'products', localField: '_id', foreignField: '_id', as: 'product' } },
        { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
        { $project: { productId: '$_id', productName: '$product.productName', customerCount: 1 } }
      ]);
      const featureAdoptionAgg = await Customer.aggregate([
        { $unwind: '$featureList' },
        { $group: { _id: '$featureList', customerCount: { $sum: 1 } } },
        { $lookup: { from: 'features', localField: '_id', foreignField: '_id', as: 'feature' } },
        { $unwind: { path: '$feature', preserveNullAndEmptyArrays: true } },
        { $project: { featureId: '$_id', featureName: '$feature.name', customerCount: 1 } }
      ]);
      const versionDistributionAgg = await Customer.aggregate([
        { $group: { _id: { productId: '$currentProductID', version: '$version' }, count: { $sum: 1 } } },
        { $project: { productId: '$_id.productId', version: '$_id.version', count: 1 } }
      ]);

      // --- Recent Activity Feed ---
      const recentCustomers = await Customer.find().sort({ createdAt: -1 }).limit(5).select('_id companyName createdAt');
      const recentFeedback = await Feedback.find().sort({ createdAt: -1 }).limit(5).select('_id customerId productId createdAt');
      const recentCompletedVOCProjects = await VOC.find({ status: 'Completed' }).sort({ vocEndDate: -1 }).limit(5).select('_id projectName vocEndDate');
      const highPriorityPendingRequests = await CustomerRequest.find({ 'priority': 'high', 'action.status': 'pending' }).select('_id customerId title priority');

      res.json({
        keyMetrics: {
          totalCustomers,
          activeVOCProjects,
          averageCustomerRating,
          pendingRequests,
          vocCompletionRate,
          formResponseCount,
        },
        customerAnalytics: {
          customerStatus,
          proficiencyLevels,
          businessTypes,
          planTypes,
          topLocations,
          customerGrowth,
        },
        vocProjectInsights: {
          vocProjectStatus,
          vocCompletionRate,
          avgVOCDurationDays,
          topParticipatingCustomers,
        },
        feedbackOverview: {
          overallRating,
          ratingDistribution,
          feedbackVolumeThisMonth,
          feedbackChannels,
          feedbackTrend,
        },
        customerRequests: {
          requestStatus,
          requestTypes,
          avgRequestResolutionDays,
          requestPriorityDistribution,
          topRequestedFeatures,
        },
        productPerformance: {
          productUsage: productUsageAgg,
          featureAdoption: featureAdoptionAgg,
          versionDistribution: versionDistributionAgg,
        },
        recentActivityFeed: {
          recentCustomers: recentCustomers.map(c => ({ customerId: c._id, customerName: c.companyName, createdAt: c.createdAt })),
          recentFeedback: recentFeedback.map(f => ({ feedbackId: f._id, customerId: f.customerId, productId: f.productId, createdAt: f.createdAt })),
          recentCompletedVOCProjects: recentCompletedVOCProjects.map(v => ({ vocProjectId: v._id, projectName: v.projectName, completedAt: v.vocEndDate })),
          highPriorityPendingRequests: highPriorityPendingRequests.map(r => ({ requestId: r._id, customerId: r.customerId, title: r.title, priorityLevel: r.priority })),
        },
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

module.exports = dashboardController;
