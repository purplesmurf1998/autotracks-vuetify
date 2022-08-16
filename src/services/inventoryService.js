import http from "./baseApiHttp";

class InventoryService {
  getVehicle(activeDealershipId, vehicleId) {
    return http.get(`dealerships/${activeDealershipId}/vehicles/${vehicleId}`);
  }

  getVehicles(activeDealershipId) {
    return http.get(`dealerships/${activeDealershipId}/vehicles`);
  }

  deleteVehicle(activeDealershipId, vehicleId) {
    return http.delete(
      `dealerships/${activeDealershipId}/vehicles/${vehicleId}`
    );
  }

  updateVehicle(activeDealershipId, vehicleId, httpData) {
    return http.put(
      `dealerships/${activeDealershipId}/vehicles/${vehicleId}`,
      httpData
    );
  }

  getHeaders(activeDealershipId) {
    return http.get(`dealerships/${activeDealershipId}/property-configs`);
  }

  updateHeaders(activeDealershipId, propertyConfigId, httpData) {
    return http.put(
      `dealerships/${activeDealershipId}/property-configs/${propertyConfigId}`,
      httpData
    );
  }

  createVehicle(activeDealershipId, httpData) {
    return http.post(`dealerships/${activeDealershipId}/vehicles`, httpData);
  }
}

export default new InventoryService();
