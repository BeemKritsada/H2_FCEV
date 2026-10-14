export type VehicleId = 'truck' | 'bus' | 'car'
export type CarouselPosition = 'left' | 'center' | 'right'

const vehicleIds: VehicleId[] = ['truck', 'bus', 'car']

export function getVehicleCarouselPosition(vehicleId: VehicleId, activeVehicleId: VehicleId): CarouselPosition {
  const offset = (vehicleIds.indexOf(vehicleId) - vehicleIds.indexOf(activeVehicleId) + vehicleIds.length) % vehicleIds.length
  return offset === 0 ? 'center' : offset === 1 ? 'right' : 'left'
}
