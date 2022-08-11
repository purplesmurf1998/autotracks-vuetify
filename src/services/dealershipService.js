import http from "./baseApiHttp";

class DealershipService {
  getProperties(dealershipId) {
    return http.get(`dealerships/${dealershipId}/properties`);
  }

  getProperty(dealershipId, propertyId) {
    return http.get(`dealerships/${dealershipId}/properties/${propertyId}`);
  }

  updateProperty(dealershipId, propertyId, httpData) {
    return http.put(
      `dealerships/${dealershipId}/properties/${propertyId}`,
      httpData
    );
  }

  deleteProperty(dealershipId, propertyId) {
    return http.delete(`dealerships/${dealershipId}/properties/${propertyId}`);
  }

  createProperty(dealershipId, httpData) {
    return http.post(`dealerships/${dealershipId}/properties`, httpData);
  }

  getDealership(accountId, dealershipId) {
    return http.get(`accounts/${accountId}/dealerships/${dealershipId}`);
  }

  getDealerships(accountId) {
    return http.get(`accounts/${accountId}/dealerships`);
  }

  activateDealership(accountId, dealershipId) {
    return http.post(
      `accounts/${accountId}/dealerships/${dealershipId}/activate`
    );
  }

  geocodeDealership(accountId, httpData) {
    return http.post(`accounts/${accountId}/dealerships/geocode`, httpData);
  }

  createDealership(accountId, httpData) {
    return http.post(`accounts/${accountId}/dealerships`, httpData);
  }
}

export default new DealershipService();
