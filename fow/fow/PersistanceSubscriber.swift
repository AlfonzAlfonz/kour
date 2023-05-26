import Foundation
import Combine
import CoreData

class PersistanceSubscriber: NSObject {
    var container: NSPersistentCloudKitContainer = NSPersistentCloudKitContainer(name: "Model");

    override init() {
        super.init()
        
        #if DEBUG
        do {
            // Use the container to initialize the development schema.
            try container.initializeCloudKitSchema(options: [])
        } catch {
            // Handle any errors.
        }
        #endif
        
        container.loadPersistentStores { description, error in
            if let error = error {
                fatalError("Error: \(error.localizedDescription)")
            }
        }
    }
    
    func save() {
        let context = container.viewContext

        if context.hasChanges {
            do {
                try context.save()
            } catch {
                // Show some error here
            }
        }
    }
}

extension PersistanceSubscriber : Subscriber {
    typealias Input = LocationPublisher.Output
    typealias Failure = Never
    
    
    
    func receive(subscription: Subscription) {
        subscription.request(Subscribers.Demand.unlimited)
    }
    
    func receive(_ input: LocationPublisher.Output) -> Subscribers.Demand {
        let entry = LocationEntry(context: container.viewContext)
        entry.timestamp = input.timestamp
        entry.latitude = input.latitude
        entry.longitude = input.longitude
        
        save()
        return .unlimited
        
    }
    
    func receive(completion: Subscribers.Completion<Never>) {
        
    }
}
