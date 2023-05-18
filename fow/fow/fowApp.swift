import SwiftUI
import CoreLocation
import Combine
import Sentry


@main
struct fowApp: App {
    @ObservedObject private var viewModel = LocationsViewModel()
    
    init() {
        SentrySDK.start { options in
            options.dsn = "https://beeea9a05bc64650a646cc595f72dcc6@o4505120852606976.ingest.sentry.io/4505205360885760"
            
            options.enablePreWarmedAppStartTracing = true
            options.attachScreenshot = true
            options.attachViewHierarchy = true
            options.enableMetricKit = true
            options.enableCoreDataTracing = false
        }
    }
    
    var body: some Scene {
        WindowGroup {
            VStack{
                ContentView(items: viewModel.items)
                    .environment(\.managedObjectContext, viewModel.locationStore.container.viewContext)
            }
        }
    }
}
