import SwiftUI
import CoreLocation
import CoreData
import MapKit


struct ContentView: View {
    var items: [LocationEntry]

    
    var body: some View {
        MapLayout {
//            FOWMap(locations: items)
            WebMap(items: items)
        }
    }
}
