import SwiftUI
import CoreLocation
import Combine
import Sentry


@main
struct fowApp: App {
    @ObservedObject private var viewModel = LocationsViewModel(
        requestOnInit: UserDefaults.standard.integer(forKey: "welcomeModalSteps") == 2
    )
    
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
                    .environment(\.locationPublisher, viewModel.locationPublisher)
                    .environment(\.font, .tinos)
            }
        }
    }
}

private struct LocationPublisherKey: EnvironmentKey {
    static let defaultValue: LocationPublisher? = nil
}


extension EnvironmentValues {
    var locationPublisher: LocationPublisher? {
        get { self[LocationPublisherKey.self] }
        set { self[LocationPublisherKey.self] = newValue }
    }
}

extension Font {
    static func yatra(size: CGFloat) -> Font { return Font.custom("Yatra One", size: size) }
    static func yatra(_ size: YatraFontSize) -> Font { return Font.custom("Yatra One", size: size.rawValue) }
    static let yatra = yatra(size: 16)
    
    static let tinos = Font.custom("Tinos", size: 20)
}

enum YatraFontSize: CGFloat {
    case title = 24
    case normal = 16
    case button = 20
}

extension Color {
    static let background = Color.init("Background")
}
