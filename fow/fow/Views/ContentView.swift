import SwiftUI
import CoreLocation
import CoreData
import MapKit


struct ContentView: View {
    var items: [LocationEntry]
    
    var hideWelcomeMoal = false

    var body: some View {
        ZStack {
            TabView() {
                WebMap(items: items).tabItem {
                    Image(systemName: "map")
                    Text("Map")
                }
                    .background(Color.init("Background"))
                    .tag(1)
                Settings().tabItem {
                    Image(systemName: "slider.horizontal.3")
                    Text("Settings")

                }.tag(2)
            }
            if !hideWelcomeMoal {
                WelcomeModal()
            }
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        ContentView(items: [], hideWelcomeMoal: true)
    }
}
