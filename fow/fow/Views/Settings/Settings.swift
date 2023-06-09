import SwiftUI
import UniformTypeIdentifiers

struct Settings: View {
    @Environment(\.managedObjectContext) var managedObjectContext
    
    @FetchRequest(sortDescriptors: [SortDescriptor(\.timestamp)])
    var locations: FetchedResults<LocationEntry>
    
    @State var showReset: Bool = false
    @State var showExport: Bool = false
    @State var showAbout: Bool = false
    @State var showMapType: Bool = false
    
    var body: some View {
        VStack {
            Text("Kouř")
                .font(.yatra(size: 32))
                .background(.background)
                .padding(.bottom, -6)
            List {
//                Button("Export") {
//                    var text  = ""
//                    for l in locations {
//                        text += "\(l.timestamp),\(l.latitude),\(l.longitude)\n"
//                    }
//                    print(text)
//                    showExport = true
//                }.fileExporter(
//                    isPresented: $showExport,
//                    document: TextFile(locations: locations),
//                    contentType: .plainText
//                ) { result in
//
//                }
                HStack{
                    Button("Map type") {
                        showMapType = true
                    }
                    Spacer()
                }.sheet(isPresented: $showMapType, content: { SettingsMapType(close: { showMapType = false }) })
                Button("About Kouř") {
                    showAbout = true
                }.sheet(isPresented: $showAbout, content: { SettingsAbout() })
                //            Text("Danger")
                //            Button("Reset") {
                //                showReset = true
                //            }
                //            .confirmationDialog(
                //                "Are you sure?",
                //                 isPresented: $showReset
                //            ) {
                //                Button("Yes, delete all data") {
                ////                        for l in locations {
                ////                            managedObjectContext.delete(l)
                ////                        }
                ////                        do {
                ////                            try managedObjectContext.save()
                ////                        } catch {
                ////
                ////                        }
                //                    showReset = false
                //                }
                //                    .foregroundColor(.red)
                //                Button("No") {
                //                    showReset = false
                //                }
                //            }
            }.background(.background)
        }
    }
}

struct Settings_Previews: PreviewProvider {
    static var previews: some View {
        Settings()
    }
}

struct TextFile: FileDocument {
    // tell the system we support only plain text
    static var readableContentTypes = [UTType.plainText]

    // by default our document is empty
    var text = ""

    // a simple initializer that creates new, empty documents
    init(initialText: String = "") {
        text = initialText
    }
    
    init(locations: FetchedResults<LocationEntry>) {
        for l in locations {
            text += "\(l.timestamp),\(l.latitude),\(l.longitude)\n"
        }
    }

    // this initializer loads data that has been saved previously
    init(configuration: ReadConfiguration) throws {
        if let data = configuration.file.regularFileContents {
            text = String(decoding: data, as: UTF8.self)
        }
    }

    // this will be called when the system wants to write our data to disk
    func fileWrapper(configuration: WriteConfiguration) throws -> FileWrapper {
        let data = Data(text.utf8)
        return FileWrapper(regularFileWithContents: data)
    }
}
