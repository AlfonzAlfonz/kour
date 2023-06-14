import SwiftUI

struct SettingsMapType: View {
    static var types = [
        MapType(
            name: "Streets (default)",
            url: "https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=cHdSuknoOcLSEePavjoJ",
            assetName: "Streets"),
        MapType(
            name: "Satelite",
            url: "https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}@2x.jpg?key=cHdSuknoOcLSEePavjoJ",
            assetName: "Satellite"
        ),
        MapType(
            name: "OSM Standard",
            url: "https://tile.openstreetmap.org/${z}/${x}/${y}.png",
            assetName: "OSM_Standard"
        )
    ]

    
    @AppStorage("map_type") var mapType: String = SettingsMapType.types[0].url;
    
    var close: () -> ()

    
    var body: some View {
        VStack {
            Text("Map Type").font(.yatra(.title)).padding(.bottom, -6)
            List {
                ForEach(SettingsMapType.types) { type in
                    let selected = type.url == mapType
                    button(type, selected)
                }
            }
        }
    }
    
    func button(
        _ type: MapType,
        _ selected: Bool
    ) -> some View {
        Section(type.name) {
            Button(action: {
                mapType = type.url
                close()
            }) {
                Image(type.assetName)
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .padding(.top, -12)
                    .padding(.horizontal, -16)
                HStack {
                    selected
                    ? Text("Selected")
                    : Text("Select")
                        .foregroundColor(.accentColor)
                        .fontWeight(.semibold)
                    Spacer()
                }
            }.disabled(selected)
        }
    }
}

struct SettingsMapType_Previews: PreviewProvider {
    static var previews: some View {
        SettingsMapType(close: {})
    }
}

struct MapType: Identifiable {
    let id = UUID()
    let name: String
    let url: String
    let assetName: String
}
