import Foundation
import CoreLocation
import CoreData
import Combine

final class LocationsViewModel: ObservableObject {
    var locationPublisher: LocationPublisher
    var locationStore = LocationStore()
    var cancellables = [AnyCancellable]()
    
    @Published var items: [LocationEntry] = []
    
    init(requestOnInit: Bool) {
        locationPublisher = LocationPublisher()
        if (requestOnInit) {
            locationPublisher.requestAuthorization()
        }
        items.append(contentsOf: locationStore.fetchLocations())
        locationPublisher.sink(receiveValue: receiveLocation).store(in: &cancellables)
    }
    
    func receiveLocation (output: LocationPublisher.Output) {
        let location = locationStore.toLocation(output)
        items.append(location)
        
        locationStore.save()
    }
    
}


