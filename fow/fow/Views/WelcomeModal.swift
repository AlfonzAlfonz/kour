import SwiftUI

struct WelcomeModal: View {
    @AppStorage("welcomeModalSteps") var welcomeModalSteps: Int = 0
    
    
    var body: some View {
        if(welcomeModalSteps == 0) {
            WelcomeModalStep1(close: { welcomeModalSteps = 1 })
        }
        
        if(welcomeModalSteps == 1) {
            WelcomeModalStep2(close: { welcomeModalSteps = 2 })
        }
    }
}

struct WelcomeModalStep1: View {
    @Environment(\.locationPublisher) var locationPublisher
    
    var close: () -> ()
    
    var body: some View {
        VStack {
            Spacer()
            VStack {
                Text("Welcome to Kouř")
                    .font(.yatra(.title))
                    .padding(.bottom, 6)
                Text("WelcomeModalStep1Description")
                Button("Allow tracking") {
                    locationPublisher?.requestAuthorization()
                    close()
                }
                    .padding(.vertical, 4)
                    .font(.yatra(.button))
            }
            .padding(.horizontal, 20)
            .padding(.vertical, 16)
            .background(.background)
            .cornerRadius(8)
            .padding(40)
            Spacer()
        }
        .ignoresSafeArea()
        .background(Color.init(red: 0, green: 0, blue: 0, opacity: 0.6))
    }
}

struct WelcomeModalStep2: View {
    
    var close: () -> ()
    
    var body: some View {
        VStack {
            Spacer()
            VStack {
                Text("Tracking settings")
                    .font(.yatra(.title))
                    .padding(.bottom, 6)
                Text("WelcomeModalStep2Description")
                Image("TrackingSettings")
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .padding(.horizontal, -20)
                Button("Open settings") {
                    close()
                    UIApplication.shared.open(
                        URL(string: UIApplication.openSettingsURLString)!
                    )
                }.padding(.vertical, 8).font(.yatra(.button))
            }
            .padding(.horizontal, 20)
            .padding(.vertical, 16)
            .background(.background)
            .cornerRadius(8)
            .padding(40)
            Spacer()
        }
        .ignoresSafeArea()
        .background(Color.init(red: 0, green: 0, blue: 0, opacity: 0.6))
    }
}

struct WelcomeView_Previews: PreviewProvider {
    static var previews: some View {
        WelcomeModal()
    }
}
