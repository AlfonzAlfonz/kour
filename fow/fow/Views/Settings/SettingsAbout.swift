import SwiftUI

struct SettingsAbout: View {
    let attributions: [Attribution] = [
        Attribution(name: "Leaflet", text: """
Website:
https://leafletjs.com/
"""),
        Attribution(name: "OpenStreetMaps", text: """
Licensed under license:
https://www.openstreetmap.org/copyright
"""),
        Attribution(name: "Map Tiler", text: """
Licensed under license:
https://www.maptiler.com/copyright/
"""),
    ]
    
    var body: some View {
        VStack {
            Text("Kouř").font(.yatra(.title)).padding(.bottom, -6)
            List {
                Section("Credits") {
                    VStack (alignment: .leading) {
                        Text("Denis Homolík")
                        Text("Development, design").font(.system(size: 16))
                        Link(
                            "https://homolik.cz/",
                            destination: URL(string: "https://homolik.cz/")!
                        ).font(.system(size: 16))

                    }
                    VStack (alignment: .leading) {
                        Text("Margarita Ryzhakova")
                        Text("Logo, fog texture design, ideas").font(.system(size: 16))
                        Link(
                            "@margarityperly",
                            destination: URL(string: "https://www.instagram.com/margarityperly/")!
                        ).font(.system(size: 16))
                    }
                    VStack (alignment: .leading) {
                        Text("Michaela Vlčková")
                        Text("Testing").font(.system(size: 16))
                        Link(
                            "???",
                            destination: URL(string: "???")!
                        ).font(.system(size: 16))
                    }
                }.font(.yatra)
                Section("Attribution") {
                    ForEach(attributions, content: { attr in
                        VStack(alignment: .leading) {
                            Text(attr.name).padding(.bottom, 4)
                            Label(attr.text, systemImage: "link").font(.system(size: 16))
                        }
                    })
                }.font(.yatra)
            }
            Spacer()
        }.padding(.top, 16)
    }
}

struct SettingsAbout_Previews: PreviewProvider {
    static var previews: some View {
        SettingsAbout()
    }
}

struct Attribution : Identifiable {
    let id = UUID()
    let name: String
    let text: String
}
