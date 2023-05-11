import SwiftUI
import MapKit

struct MapLayout<Label>: View where Label: View {
    var label: () -> Label
    
    @State var settingsOpen = false
    
    var body: some View {
        ZStack {
            label()
            VStack {
                ZStack {
                    HStack {
                        Spacer()
                        Text("FOW")
                        Spacer()
                    }
                    HStack {
                        Spacer()
                        Button {
                            settingsOpen = !settingsOpen
                        } label: {
                            Image(systemName: "slider.horizontal.3")
                        }
                        .sheet(isPresented: $settingsOpen, content: {
                            Settings()
                        })
                    }
                }
                    .padding(.horizontal, 10)
                    .padding(.bottom, 15)
                    .background(.background)
                    .shadow(radius: 5)
                Spacer()
            }
        }
    }
}

struct MapLayout_Previews: PreviewProvider {
    static var previews: some View {
        MapLayout() {
            Spacer().background(.black)
        }
    }
}
