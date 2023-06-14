import SwiftUI
import CoreLocation
import CoreData
import MapKit


struct ContentView: View {
    var items: [LocationEntry]
    
    var hideWelcomeMoal = false
    
    @State var settings = false

    var body: some View {
        ZStack {
            YatraTabView(map: {
                WebMap(items: items)
            }, settings: {
                Settings()
            })
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

struct YatraTabView<M: View, S: View>: View {
    let map: () -> M
    let settings: () -> S
    
    @State var displaySettings = false
    
    var body: some View {
        ZStack() {
            if displaySettings {
                settings()
            } else {
                map()
            }
            VStack {
                Spacer()
                HStack() {
                    Spacer()
                    Button(action: {
                        displaySettings = false
                    }, label: {
                        VStack {
                            Image(systemName: "map")
                            Text("Map")
                        }
                    })
                    Spacer()
                    Spacer()
                    Button(action: {
                        displaySettings = true
                    }, label: {
                        VStack {
                            Image(systemName: "slider.horizontal.3")
                            Text("Settings")
                        }
                    })
                    Spacer()
                }
                .font(.tinos)
                .padding(.top, 10)
                .padding(.bottom, 4)
                .background(Color.init("Background"))
            }
        }
    }
}
