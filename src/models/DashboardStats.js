const mongoose = require('mongoose');

const DashboardStatsSchema = new mongoose.Schema({
  keyMetrics: {
    totalCustomers: Number,
    activeVOCProjects: Number,
    averageCustomerRating: Number,
    pendingRequests: Number,
  },
  customerAnalytics: {
    customerStatus: {
      active: Number,
      inactive: Number,
    },
    proficiencyLevels: {
      beginner: Number,
      intermediate: Number,
      advanced: Number,
    },
    businessTypes: [
      {
        type: { type: String },
        count: Number,
      },
    ],
    planTypes: [
      {
        plan: String,
        count: Number,
      },
    ],
    topLocations: [
      {
        location: String,
        count: Number,
      },
    ],
    customerGrowth: {
      currentMonth: Number,
      previousMonth: Number,
    },
  },
  vocProjectInsights: {
    vocProjectStatus: {
      upcoming: Number,
      ongoing: Number,
      completed: Number,
      cancelled: Number,
    },
    vocCompletionRate: Number,
    activeVOCCount: Number,
    avgVOCDurationDays: Number,
    topParticipatingCustomers: [
      {
        customerId: String,
        count: Number,
      },
    ],
  },
  feedbackOverview: {
    overallRating: Number,
    ratingDistribution: {
      one: Number,
      two: Number,
      three: Number,
      four: Number,
      five: Number,
    },
    feedbackVolumeThisMonth: Number,
    feedbackChannels: {
      email: Number,
      phone: Number,
      survey: Number,
      whatsapp: Number,
    },
    feedbackTrend: {
      currentMonth: Number,
      previousMonth: Number,
    },
  },
  customerRequests: {
    requestStatus: {
      open: Number,
      closed: Number,
      inProgress: Number,
    },
    requestTypes: {
      bug: Number,
      feature: Number,
      support: Number,
    },
    avgRequestResolutionDays: Number,
    requestPriorityDistribution: {
      high: Number,
      medium: Number,
      low: Number,
    },
    topRequestedFeatures: [
      {
        featureName: String,
        count: Number,
      },
    ],
  },
  productPerformance: {
    productUsage: [
      {
        productId: String,
        version: String,
        customerCount: Number,
      },
    ],
    featureAdoption: [
      {
        featureName: String,
        customerCount: Number,
      },
    ],
    versionDistribution: [
      {
        productId: String,
        version: String,
        count: Number,
      },
    ],
  },
  recentActivityFeed: {
    recentCustomers: [
      {
        customerId: String,
        customerName: String,
        createdAt: Date,
      },
    ],
    recentFeedback: [
      {
        feedbackId: String,
        customerId: String,
        productId: String,
        createdAt: Date,
      },
    ],
    recentCompletedVOCProjects: [
      {
        vocProjectId: String,
        projectName: String,
        completedAt: Date,
      },
    ],
    highPriorityPendingRequests: [
      {
        requestId: String,
        customerId: String,
        title: String,
        priorityLevel: String,
      },
    ],
  },
  meta: {
    lastUpdated: { type: Date, default: Date.now },
  },
});

const DashboardStats = mongoose.models.DashboardStats || mongoose.model('DashboardStats', DashboardStatsSchema);

module.exports = DashboardStats;
