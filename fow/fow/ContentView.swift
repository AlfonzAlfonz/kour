import SwiftUI
import CoreLocation
import CoreData
import MapKit


struct ContentView: View {
    @ObservedObject var viewModel: LocationArrayViewModel
    
    init(locations: LocationsViewModel) {
        viewModel = LocationArrayViewModel(locations.persistanceSubscriber.container.viewContext)
    }

    
    var body: some View {
        MapLayout {
//            FOWMap(locations: viewModel.items)
            WebMap(items: $viewModel.items)
        }
    }
}

class LocationArrayViewModel: NSObject, ObservableObject  {
    @Published var items: [LocationEntry] = []
    
    private let controller: NSFetchedResultsController<LocationEntry>
    
    init(_ managedObjectContext: NSManagedObjectContext) {
        let req = LocationEntry.fetchRequest();
        req.sortDescriptors = [
            NSSortDescriptor(key: "timestamp", ascending: true)
        ]
        
        let weekAgo = Calendar.current.date(byAdding: .day, value: -7, to: Date.now) ?? Date.now
        let timestamp = Int(weekAgo.timeIntervalSince1970)
        
        req.predicate = NSPredicate(format: "timestamp > %@", argumentArray: [timestamp])
            
        controller = NSFetchedResultsController(
            fetchRequest: req,
            managedObjectContext: managedObjectContext,
            sectionNameKeyPath: nil, cacheName: nil
        )
        
        super.init()

        controller.delegate = self

        do {
            try controller.performFetch()
            if let entries = controller.fetchedObjects {
                items = entries
            }
        } catch {
            print("failed to fetch items!")
        }
    }
}

extension LocationArrayViewModel: NSFetchedResultsControllerDelegate {
  func controllerDidChangeContent(_ controller: NSFetchedResultsController<NSFetchRequestResult>) {
      guard let entries = controller.fetchedObjects as? [LocationEntry] else { return }
      
      items = entries
  }
}
