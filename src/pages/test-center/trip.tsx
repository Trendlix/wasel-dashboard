import { useEffect, useMemo, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { testCenterTripSchema, type TestCenterTripFormValues } from "@/shared/schemas/test-center-trip.schema";
import useTestCenterTripStore from "@/shared/hooks/store/useTestCenterTripStore";

const TestCenterTripTab = () => {
    const {
        users,
        truckTypes,
        goodsTypes,
        loadingOptions,
        submitting,
        requestStatusSubmitting,
        tripStatusSubmitting,
        fanoutSubmitting,
        diagnosticsLoading,
        offers,
        fanoutDiagnostics,
        error,
        successMessage,
        fetchOptions,
        submitTripRequest,
        updateRequestStatus,
        fetchOffersForRequest,
        acceptOffer,
        updateTripStatus,
        refanoutRequest,
        fetchFanoutDiagnostics,
    } = useTestCenterTripStore();
    const [goodsImages, setGoodsImages] = useState<File[]>([]);
    const [activeRequestId, setActiveRequestId] = useState<number>(0);
    const [manualRequestId, setManualRequestId] = useState<number>(0);
    const [requestStatus, setRequestStatus] = useState<"pending" | "expired" | "confirmed">("pending");
    const [activeTripId, setActiveTripId] = useState<number>(0);
    const [tripStatus, setTripStatus] = useState<string>("on_the_way");
    const [userSearch, setUserSearch] = useState("");
    const tripStatuses = ["pending", "accepted", "scheduled", "on_the_way", "arrived", "picked_up", "delivered", "completed", "cancelled"];
    const filteredUsers = useMemo(() => {
        const query = userSearch.trim().toLowerCase();
        if (!query) return users;
        return users.filter((user) => {
            const id = String(user.id);
            const name = user.name.toLowerCase();
            const phone = (user.phone || "").toLowerCase();
            return id.includes(query) || name.includes(query) || phone.includes(query);
        });
    }, [users, userSearch]);
    const toUserLabel = (user: { id: number; name: string; phone?: string }) => {
        const raw = `${user.name}${user.phone ? ` - ${user.phone}` : ""} (#${user.id})`;
        return raw.length > 90 ? `${raw.slice(0, 90)}...` : raw;
    };

    const form = useForm<TestCenterTripFormValues>({
        resolver: zodResolver(testCenterTripSchema),
        defaultValues: {
            user_id: 0,
            user_lat: 0,
            user_long: 0,
            pickup_lat: 0,
            pickup_long: 0,
            pickup_name: "",
            trip_at: "",
            type_of_goods_id: 0,
            type_of_truck_id: 0,
            total_weight: 0,
            currency: "EGP",
            offered_price_by_user: 0,
            special_notes: "",
            drop_off_locations: [{ lat: 0, long: 0, destination_name: "" }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "drop_off_locations",
    });

    useEffect(() => {
        fetchOptions();
    }, [fetchOptions]);

    const useCurrentLocation = () => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = Number(position.coords.latitude.toFixed(6));
            const lng = Number(position.coords.longitude.toFixed(6));
            form.setValue("user_lat", lat);
            form.setValue("user_long", lng);
            form.setValue("pickup_lat", lat);
            form.setValue("pickup_long", lng);
        });
    };

    const openMapWithCoords = (lat: number, lng: number) => {
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
        window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank", "noopener,noreferrer");
    };

    const onSubmit = async (values: TestCenterTripFormValues) => {
        const requestId = await submitTripRequest(
            {
                ...values,
                trip_at: new Date(values.trip_at).toISOString(),
            },
            goodsImages,
        );
        if (requestId) {
            setActiveRequestId(requestId);
            await fetchOffersForRequest(requestId);
        }
    };

    return (
        <div className="rounded-2xl border border-main-whiteMarble bg-main-white p-6 space-y-5 shadow-[0_8px_24px_rgba(17,24,39,0.04)]">
            <h2 className="text-lg font-semibold text-main-mirage">Create Trip Request As User</h2>
            <p className="text-sm text-main-coolGray">
                Submit `user_id` and request payload as admin for testing.
            </p>

            {error && <div className="rounded-lg bg-main-remove/10 text-main-remove px-3 py-2 text-sm">{error}</div>}
            {successMessage && <div className="rounded-lg bg-main-primary/10 text-main-primary px-3 py-2 text-sm">{successMessage}</div>}

            <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="rounded-xl border border-main-whiteMarble bg-main-titaniumWhite/20 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <p className="text-sm font-semibold text-main-mirage">Coordinates helper</p>
                            <p className="text-xs text-main-coolGray">Use your current location and open maps for quick coordinate checks.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button type="button" variant="outline" onClick={useCurrentLocation}>
                                Use current location
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => openMapWithCoords(form.getValues("pickup_lat"), form.getValues("pickup_long"))}
                            >
                                Open pickup on map
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <Label>User ID</Label>
                        <Input
                            value={userSearch}
                            onChange={(event) => setUserSearch(event.target.value)}
                            placeholder="Search by name, phone, or ID"
                        />
                        <Controller
                            control={form.control}
                            name="user_id"
                            render={({ field }) => (
                                <Select value={String(field.value || 0)} onValueChange={(value) => field.onChange(Number(value))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select user" />
                                    </SelectTrigger>
                                    <SelectContent
                                        position="popper"
                                        className="max-h-80 w-(--radix-select-trigger-width)"
                                    >
                                        <SelectItem value="0" className="truncate">Select user</SelectItem>
                                        {filteredUsers.map((user) => (
                                            <SelectItem key={user.id} value={String(user.id)} className="pr-8">
                                                {toUserLabel(user)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        <p className="text-xs text-main-coolGray">
                            {filteredUsers.length} user(s) shown
                        </p>
                    </div>
                    <div className="space-y-1.5">
                        <Label>Trip date and time</Label>
                        <Input type="datetime-local" {...form.register("trip_at")} />
                    </div>
                    <div className="space-y-1.5">
                        <Label>User latitude</Label>
                        <Input type="number" step="any" placeholder="e.g. 30.0444" {...form.register("user_lat", { valueAsNumber: true })} />
                    </div>
                    <div className="space-y-1.5">
                        <Label>User longitude</Label>
                        <Input type="number" step="any" placeholder="e.g. 31.2357" {...form.register("user_long", { valueAsNumber: true })} />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Pickup latitude</Label>
                        <Input type="number" step="any" placeholder="Pickup lat" {...form.register("pickup_lat", { valueAsNumber: true })} />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Pickup longitude</Label>
                        <Input type="number" step="any" placeholder="Pickup long" {...form.register("pickup_long", { valueAsNumber: true })} />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Pickup name</Label>
                        <Input placeholder="e.g. Riyadh Warehouse" {...form.register("pickup_name")} />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Goods type</Label>
                        <Controller
                            control={form.control}
                            name="type_of_goods_id"
                            render={({ field }) => (
                                <Select value={String(field.value || 0)} onValueChange={(value) => field.onChange(Number(value))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select goods type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">Select goods type</SelectItem>
                                        {goodsTypes.map((goods) => (
                                            <SelectItem key={goods.id} value={String(goods.id)}>
                                                {goods.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Truck type</Label>
                        <Controller
                            control={form.control}
                            name="type_of_truck_id"
                            render={({ field }) => (
                                <Select value={String(field.value || 0)} onValueChange={(value) => field.onChange(Number(value))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select truck type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="0">Select truck type</SelectItem>
                                        {truckTypes.map((truck) => (
                                            <SelectItem key={truck.id} value={String(truck.id)}>
                                                {truck.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Total weight</Label>
                        <Input type="number" step="any" placeholder="e.g. 15" {...form.register("total_weight", { valueAsNumber: true })} />
                    </div>
                    <div className="space-y-1.5">
                        <Label>Currency</Label>
                        <Input placeholder="e.g. EGP" {...form.register("currency")} />
                    </div>
                    <div className="space-y-1.5 md:col-span-2">
                        <Label>Offered price by user</Label>
                        <Input type="number" step="any" placeholder="e.g. 3000" {...form.register("offered_price_by_user", { valueAsNumber: true })} />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <Label>Special notes (optional)</Label>
                    <Textarea placeholder="Any handling or route notes" {...form.register("special_notes")} />
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="font-medium text-main-mirage">Drop-off Locations</h3>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => append({ lat: 0, long: 0, destination_name: "" })}
                        >
                            Add drop-off
                        </Button>
                    </div>
                    {fields.map((field, index) => (
                        <div key={field.id} className="rounded-xl border border-main-whiteMarble bg-main-titaniumWhite/20 p-3 space-y-3">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                <div className="space-y-1.5">
                                    <Label>Drop-off latitude</Label>
                                    <Input type="number" step="any" placeholder="Lat" {...form.register(`drop_off_locations.${index}.lat`, { valueAsNumber: true })} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Drop-off longitude</Label>
                                    <Input type="number" step="any" placeholder="Long" {...form.register(`drop_off_locations.${index}.long`, { valueAsNumber: true })} />
                                </div>
                                <div className="space-y-1.5">
                                    <Label>Destination name</Label>
                                    <Input placeholder="e.g. Dammam Branch" {...form.register(`drop_off_locations.${index}.destination_name`)} />
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => {
                                        const lat = form.getValues(`drop_off_locations.${index}.lat`);
                                        const lng = form.getValues(`drop_off_locations.${index}.long`);
                                        openMapWithCoords(lat, lng);
                                    }}
                                >
                                    Open drop-off on map
                                </Button>
                                {fields.length > 1 && (
                                    <Button type="button" variant="destructive" onClick={() => remove(index)}>
                                        Remove
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-main-mirage">Goods Images (optional, max 4)</label>
                    <Input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg"
                        multiple
                        onChange={(event) => {
                            const nextFiles = Array.from(event.target.files ?? []).slice(0, 4);
                            setGoodsImages(nextFiles);
                        }}
                    />
                    {goodsImages.length > 0 && (
                        <p className="text-xs text-main-coolGray">{goodsImages.length} file(s) selected.</p>
                    )}
                </div>

                <div className="flex gap-2">
                    <Button type="submit" className="bg-main-primary hover:bg-main-primary/90 text-white" disabled={submitting || loadingOptions}>
                        {submitting ? "Submitting..." : "Create request"}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            form.reset();
                            setGoodsImages([]);
                        }}
                        disabled={submitting}
                    >
                        Reset
                    </Button>
                </div>

                <div className="rounded-xl border border-main-whiteMarble bg-main-titaniumWhite/20 p-4 space-y-4">
                    <h3 className="text-base font-semibold text-main-mirage">Lifecycle Test Controls</h3>
                    <p className="text-xs text-main-coolGray">
                        Flow attached to this form submission: create request, then control request status, then accept offer, then control trip status.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Active request</Label>
                            <div className="rounded-md border border-main-whiteMarble bg-main-white px-3 py-2 text-sm text-main-mirage">
                                {activeRequestId ? `Request #${activeRequestId}` : "No request yet. Create request first."}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <Input
                                    type="number"
                                    placeholder="Enter existing request ID"
                                    value={manualRequestId || ""}
                                    onChange={(event) => setManualRequestId(Number(event.target.value || 0))}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={!manualRequestId}
                                    onClick={async () => {
                                        setActiveRequestId(manualRequestId);
                                        await fetchOffersForRequest(manualRequestId);
                                    }}
                                >
                                    Load request
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <Select value={requestStatus} onValueChange={(value) => setRequestStatus(value as "pending" | "expired" | "confirmed")}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Request status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">pending</SelectItem>
                                        <SelectItem value="expired">expired</SelectItem>
                                        <SelectItem value="confirmed">confirmed</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={!activeRequestId || requestStatusSubmitting}
                                    onClick={() => updateRequestStatus(activeRequestId, requestStatus)}
                                >
                                    Set request status
                                </Button>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                disabled={!activeRequestId}
                                onClick={() => fetchOffersForRequest(activeRequestId)}
                            >
                                Fetch request offers
                            </Button>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={!activeRequestId || fanoutSubmitting}
                                    onClick={async () => {
                                        await refanoutRequest(activeRequestId);
                                        await fetchOffersForRequest(activeRequestId);
                                    }}
                                >
                                    {fanoutSubmitting ? "Re-fanout..." : "Re-fanout to drivers"}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={!activeRequestId || diagnosticsLoading}
                                    onClick={() => fetchFanoutDiagnostics(activeRequestId)}
                                >
                                    {diagnosticsLoading ? "Loading..." : "Fanout diagnostics"}
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Active trip</Label>
                            <div className="rounded-md border border-main-whiteMarble bg-main-white px-3 py-2 text-sm text-main-mirage">
                                {activeTripId ? `Trip #${activeTripId}` : "No trip yet. Accept an offer first."}
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <Select value={tripStatus} onValueChange={setTripStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Trip status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {tripStatuses.map((status) => (
                                            <SelectItem key={status} value={status}>{status}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={!activeTripId || tripStatusSubmitting}
                                    onClick={() => updateTripStatus(activeTripId, tripStatus)}
                                >
                                    Set trip status
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Offers for selected request</Label>
                        {offers.length === 0 ? (
                            <p className="text-xs text-main-coolGray">No offers loaded yet.</p>
                        ) : (
                            <div className="space-y-2">
                                {offers.map((offer) => (
                                    <div key={offer.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-main-whiteMarble bg-main-white p-3">
                                        <p className="text-sm text-main-mirage">
                                            Offer #{offer.id} - Driver: {offer.driver?.name ?? "N/A"} - Price: {offer.price ?? 0} {offer.currency ?? ""}
                                        </p>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            disabled={submitting}
                                            onClick={async () => {
                                                const tripId = await acceptOffer(offer.id);
                                                if (tripId) setActiveTripId(tripId);
                                            }}
                                        >
                                            Accept offer
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {fanoutDiagnostics && (
                        <div className="space-y-2 rounded-lg border border-main-whiteMarble bg-main-white p-3">
                            <Label>Fanout diagnostics</Label>
                            <p className="text-xs text-main-coolGray">
                                Request #{fanoutDiagnostics.request_id} ({fanoutDiagnostics.request_status})
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                                <p>Total drivers: {fanoutDiagnostics.total_drivers}</p>
                                <p>Already has offer: {fanoutDiagnostics.has_offer_already}</p>
                                <p>Eligible now: {fanoutDiagnostics.eligible_now}</p>
                                <p>Offline: {fanoutDiagnostics.offline}</p>
                                <p>Not approved: {fanoutDiagnostics.not_approved}</p>
                                <p>Missing app ref: {fanoutDiagnostics.missing_application_reference}</p>
                                <p>No matching truck: {fanoutDiagnostics.no_approved_matching_truck}</p>
                            </div>
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default TestCenterTripTab;
