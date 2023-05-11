import SwiftUI
import CoreLocation
import Combine


@main
struct fowApp: App {
    @ObservedObject private var viewModel = LocationsViewModel()
    
    var body: some Scene {
        WindowGroup {
            VStack{
                ContentView(locations: viewModel)
                    .environment(\.managedObjectContext, viewModel.persistanceSubscriber.container.viewContext)
            }
        }
    }
}
