import http from "./baseApiHttp";

class SubscriptionService {
  createSubscription(dealershipId, httpData) {
    return http.post(`dealerships/${dealershipId}/subscriptions`, httpData);
  }

  getSubscriptions(dealershipId) {
    return http.get(`dealerships/${dealershipId}/subscriptions`);
  }

  updateSubscription(dealershipId, subscriptionsId, httpData) {
    return http.put(
      `dealerships/${dealershipId}/subscriptions/${subscriptionsId}`, httpData);
  }

  deleteSubscription(dealershipId, subscriptionsId) {
    return http.delete(`dealerships/${dealershipId}/subscriptions/${subscriptionsId}`);
  }

}

export default new SubscriptionService();