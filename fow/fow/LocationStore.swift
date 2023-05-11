import Foundation
import CoreData

struct LocationStore {
    var container: NSPersistentContainer = NSPersistentContainer(name: "Model")
    
    init() {
        container.loadPersistentStores { description, error in
            if let error = error {
                fatalError("Error: \(error.localizedDescription)")
            }
        }
    }
    
    func fetchLocations() -> [LocationEntry] {
        let req = LocationEntry.fetchRequest();
        req.sortDescriptors = [
            NSSortDescriptor(key: "timestamp", ascending: true)
        ]
        
//        let weekAgo = Calendar.current.date(byAdding: .day, value: -7, to: Date.now) ?? Date.now
//        let timestamp = Int(weekAgo.timeIntervalSince1970)
//        req.predicate = NSPredicate(format: "timestamp > %@", argumentArray: [timestamp])
            
        
        let controller = NSFetchedResultsController(
            fetchRequest: req,
            managedObjectContext: container.viewContext,
            sectionNameKeyPath: nil,
            cacheName: nil
        )

        do {
            try controller.performFetch()
            if let entries = controller.fetchedObjects {
                print("entries", entries.count)
                return entries
            }
        } catch {
            print("failed to fetch items!")
        }
        
        return []
    }
    
    func toLocation(_ input: LocationPublisher.Output) -> LocationEntry {
        let entry = LocationEntry(context: container.viewContext)

        entry.timestamp = input.timestamp
        entry.latitude = input.latitude
        entry.longitude = input.longitude
        
        return entry
        
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
