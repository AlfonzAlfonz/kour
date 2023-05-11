import Foundation
import CoreLocation
import CoreData
import Combine

final class LocationsViewModel: ObservableObject {
    var locationPublisher = LocationPublisher()
    var persistanceSubscriber = PersistanceSubscriber()
    var cancellables = [AnyCancellable]()
    
    init() {
        locationPublisher.subscribe(persistanceSubscriber)
    }
}


