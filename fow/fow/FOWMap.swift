import MapKit
import SwiftUI

struct FOWMap: View {
    var locations: [LocationEntry]
    
    @State private var region = MKCoordinateRegion(
        center: CLLocationCoordinate2D(),
        latitudinalMeters: 300,
        longitudinalMeters: 300
    )
    
    @State private var follow = false
    
    var body: some View {
        ZStack {
            Map(
                coordinateRegion: $region,
                showsUserLocation: true,
                userTrackingMode: follow ? .constant(.follow) : .constant(.none),
                annotationItems: locations
            )
            {
                location in
                MapMarker(
                    coordinate: CLLocationCoordinate2D(latitude: location.latitude, longitude: location.longitude),
                    tint: Color.purple
                )
            }
            VStack {
                Spacer()
                HStack {
                    Spacer()
                        Button {
                            follow = !follow
                        } label: {
                            follow
                                ? Image(systemName: "location.fill")
                                : Image(systemName: "location")
                            
                        }
                        .padding(12)
                        .background()
                        .cornerRadius(6)
                        .shadow(radius: 5)
                        .padding(24)
                }
            }
        }.ignoresSafeArea()
    }
}

struct FOWMap_Previews: PreviewProvider {
    static var previews: some View {
        FOWMap(locations: [])
    }
}
