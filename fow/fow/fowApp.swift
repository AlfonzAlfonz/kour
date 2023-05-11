import SwiftUI
import CoreLocation
import Combine


@main
struct fowApp: App {
    @ObservedObject private var viewModel = LocationsViewModel()
    
    var body: some Scene {
        WindowGroup {
            VStack{
                ContentView(items: viewModel.items)
                    .environment(\.managedObjectContext, viewModel.locationStore.container.viewContext)
            }
        }
    }
}
