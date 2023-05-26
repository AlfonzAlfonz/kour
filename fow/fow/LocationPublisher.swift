import Combine
import CoreLocation
import Foundation
import CoreData

class LocationPublisher: NSObject {
    typealias Output = (longitude: Double, latitude: Double, timestamp: Int64)
    typealias Failure = Never
    
    private let wrapped = PassthroughSubject<(Output), Failure>()
    
    private let locationManager = CLLocationManager()
    
    private var lastPosition: Output?;
    
    override init() {
        super.init()
        self.locationManager.delegate = self
        self.locationManager.desiredAccuracy = kCLLocationAccuracyNearestTenMeters
        self.locationManager.distanceFilter = 50
    }
    
    func requestAuthorization() {
        self.locationManager.allowsBackgroundLocationUpdates = true
        self.locationManager.showsBackgroundLocationIndicator = true
        self.locationManager.requestAlwaysAuthorization()
        self.locationManager.startUpdatingLocation()
    }
}

extension LocationPublisher: CLLocationManagerDelegate {
    
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
    }

    func locationManager(_ manager: CLLocationManager, didChangeAuthorization status: CLAuthorizationStatus) {
        if status == .authorizedAlways || status == .authorizedWhenInUse {
            locationManager.requestLocation()
        }
    }

    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        guard let location = locations.last else { return }
        let here = (
            longitude: location.coordinate.longitude,
            latitude: location.coordinate.latitude,
            timestamp: Int64(location.timestamp.timeIntervalSince1970)
        );
        
        if let last = lastPosition {
            let distance = distanceM(last, here)
            
            if(distance < 10) { return }
        }
        
        lastPosition = here
        
        wrapped.send(here)
    }
}

extension LocationPublisher: Publisher {
    func receive<Downstream: Subscriber>(subscriber: Downstream) where Failure == Downstream.Failure, Output == Downstream.Input {
        wrapped.subscribe(subscriber)
    }
}

func distanceM(_ pos1: LocationPublisher.Output, _ pos2: LocationPublisher.Output) -> Double {
    var lat1 = pos1.latitude
    let lon1 = pos1.longitude
    var lat2 = pos2.latitude
    let lon2 = pos2.longitude
    
    let earthRadiusKm: Double = 6371;

    let dLat = degreesToRadians(lat2-lat1);
    let dLon = degreesToRadians(lon2-lon1);

    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);

    let a = (
        sin(dLat/2) * sin(dLat/2) +
        sin(dLon/2) * sin(dLon/2) * cos(lat1) * cos(lat2)
    );
    let c = 2 * atan2(sqrt(a), sqrt(1-a));
    return earthRadiusKm * c * 1000;
}

func degreesToRadians(_ degrees: Double) -> Double {
    return degrees * Double.pi / 180;
}
