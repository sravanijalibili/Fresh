import { useEffect, useState } from "react";

import {
    MapContainer,
    Marker,
    TileLayer,
    useMap,
    useMapEvents,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import "../styles/locationpicker.css";


/*
 * Fix Leaflet marker icons
 */

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});


function LocationMarker({
    position,
    onLocationChange,
}) {

    useMapEvents({

        click(event) {

            const latitude =
                Number(
                    event.latlng.lat.toFixed(7)
                );

            const longitude =
                Number(
                    event.latlng.lng.toFixed(7)
                );


            onLocationChange([
                latitude,
                longitude,
            ]);

        },

    });


    if (!position) {
        return null;
    }


    return (
        <Marker
            position={position}
            draggable={true}
            eventHandlers={{
                dragend: (event) => {

                    const marker =
                        event.target;

                    const location =
                        marker.getLatLng();


                    const latitude =
                        Number(
                            location.lat.toFixed(7)
                        );

                    const longitude =
                        Number(
                            location.lng.toFixed(7)
                        );


                    onLocationChange([
                        latitude,
                        longitude,
                    ]);

                },
            }}
        />
    );
}


function MapCenter({
    position,
}) {

    const map = useMap();


    useEffect(() => {

        if (position) {

            map.setView(
                position,
                16
            );

        }

    }, [position, map]);


    return null;
}


function LocationPicker({
    latitude,
    longitude,
    onLocationSelect,
}) {

    const [position, setPosition] =
        useState(
            latitude !== null &&
            longitude !== null
                ? [
                      Number(latitude),
                      Number(longitude),
                  ]
                : null
        );


    const [loading, setLoading] =
        useState(false);


    const [addressLoading, setAddressLoading] =
        useState(false);


    const defaultPosition = [
        20.5937,
        78.9629,
    ];


    useEffect(() => {

        if (
            latitude !== null &&
            longitude !== null
        ) {

            setPosition([
                Number(latitude),
                Number(longitude),
            ]);

        }

    }, [latitude, longitude]);


    /*
     * Reverse Geocoding
     */

    const reverseGeocode = async (
        latitude,
        longitude
    ) => {

        try {

            setAddressLoading(true);


            const response =
                await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1`
                );


            if (!response.ok) {

                throw new Error(
                    "Unable to find address"
                );

            }


            const data =
                await response.json();


            const address =
                data.address || {};


            const house =
                address.house_number ||
                "";


            const street =
                address.road ||
                address.street ||
                "";


            const city =
                address.city ||
                address.town ||
                address.village ||
                address.municipality ||
                "";


            const state =
                address.state ||
                "";


            const pincode =
                address.postcode ||
                "";


            /*
             * Send everything back
             * to AddressForm
             */

            onLocationSelect({

                latitude,
                longitude,

                house,
                street,
                city,
                state,
                pincode,

            });

        } catch (error) {

            console.error(
                "Reverse geocoding error:",
                error
            );


            /*
             * Even if address lookup
             * fails, save coordinates.
             */

            onLocationSelect({
                latitude,
                longitude,
            });

        } finally {

            setAddressLoading(false);

        }

    };


    const handleLocationChange = (
        newPosition
    ) => {

        const latitude =
            Number(
                newPosition[0].toFixed(7)
            );


        const longitude =
            Number(
                newPosition[1].toFixed(7)
            );


        setPosition([
            latitude,
            longitude,
        ]);


        reverseGeocode(
            latitude,
            longitude
        );

    };


    /*
     * Current Location
     */

    const handleCurrentLocation = () => {

        if (!navigator.geolocation) {

            alert(
                "Location is not supported by this browser."
            );

            return;

        }


        setLoading(true);


        navigator.geolocation.getCurrentPosition(

            (location) => {

                const latitude =
                    Number(
                        location.coords.latitude.toFixed(7)
                    );


                const longitude =
                    Number(
                        location.coords.longitude.toFixed(7)
                    );


                const newPosition = [
                    latitude,
                    longitude,
                ];


                setPosition(
                    newPosition
                );


                reverseGeocode(
                    latitude,
                    longitude
                );


                setLoading(false);

            },


            (error) => {

                console.error(error);


                alert(
                    "Unable to get your current location."
                );


                setLoading(false);

            },


            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 0,
            }

        );

    };


    return (

        <div className="location-picker">

            <div className="location-picker-header">

                <h3>
                    Select Delivery Location
                </h3>


                <button
                    type="button"
                    className="current-location-btn"
                    onClick={
                        handleCurrentLocation
                    }
                    disabled={
                        loading ||
                        addressLoading
                    }
                >

                    {loading
                        ? "Getting Location..."
                        : "Use Current Location"}

                </button>

            </div>

            <MapContainer
                center={position || defaultPosition}
                zoom={position ? 16 : 5}
                scrollWheelZoom={true}
                className="location-map"
            >
                <TileLayer
                    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />

                <LocationMarker
                    position={position}
                    onLocationChange={handleLocationChange}
                />

                <MapCenter
                    position={position}
                />
            </MapContainer>


            {addressLoading && (

                <p className="address-loading">
                    Finding address...
                </p>

            )}


            {position && (

                <div className="coordinates">

                    <p>
                        <strong>
                            Latitude:
                        </strong>{" "}
                        {position[0]}
                    </p>


                    <p>
                        <strong>
                            Longitude:
                        </strong>{" "}
                        {position[1]}
                    </p>

                </div>

            )}


            <p className="map-instruction">

                Click on the map or drag the marker
                to select your exact delivery
                location.

            </p>

        </div>

    );

}


export default LocationPicker;