import Foundation
import CoreLocation
import CoreData
import Combine

final class LocationsViewModel: ObservableObject {
    var locationPublisher = LocationPublisher()
    var locationStore = LocationStore()
    var cancellables = [AnyCancellable]()
    
    @Published var items: [LocationEntry] = []
    
    init() {
        items.append(contentsOf: locationStore.fetchLocations())
        locationPublisher.sink(receiveValue: receiveLocation).store(in: &cancellables)
    }
    
    func receiveLocation (output: LocationPublisher.Output) {
        let location = locationStore.toLocation(output)
        items.append(location)
        
        locationStore.save()
    }
    
}


