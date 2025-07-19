import { useEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";

export default function DeviceModal({ show, handleClose, selectedRequest, setSelectedRequest }) {
  const [devices, setDevices] = useState(null);
  const [locations, setLocations] = useState(null);
  const [types, setTypes] = useState(null);
  const [brands, setBrands] = useState(null);
  const [makes, setMakes] = useState(null);
  const [models, setModels] = useState(null);
  const [serials, setSerials] = useState(null);

  const [device, setDevice] = useState({});
  const [location, setLocation] = useState("");
  const [type, setType] = useState("");
  const [brand, setBrand] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [serial, setSerial] = useState("");

  const [status, setStatus] = useState(selectedRequest?.borrow_status?.replace(" ", "_") ?? null);
  const [retState, setRetState] = useState(selectedRequest?.device_return_condition ?? null);
  const [removeDev, setRemoveDev] = useState(false);
  const [retDate, setRetDate] = useState(selectedRequest.return_date_val);
  const [devUsage, setDevUsage] = useState(null);

  useEffect(() => {
    (async () => {
      const response = await fetch("/api/locations/getall");

      if (!response.ok) {
        console.error("Failed to get locations.", response, await response.text());
        alert("Modal could not load device data.");
      }

      const { data } = await response.json();

      setLocations(data);
    })();
  }, [])

  useEffect(() => {
    (async () => {
      if (!location || location === "") return;

      const urlParams = new URLSearchParams();
      urlParams.append("q", `$location_id=${location}`)
      const response = await fetch(`/api/devices/getall?${urlParams}`);

      if (!response.ok) {
        console.error("Failed to get devices.", response, await response.text());
        alert("Modal could not load device data.");
        return;
      }

      let { data } = await response.json();

      data = data.filter(x => x.borrow.length === 0 || !x.borrow.some(b => ["Submitted", "Checked_out", "Scheduled"].includes(b.borrow_status)));

      setDevices(data);

      setType("");
      setBrand("");
      setMake("");
      setModel("");

      setTypes(null);
      setBrands(null);
      setMakes(null);
      setModels(null);
    })();
  }, [location]);

  useEffect(() => {
    if (!devices) return;

    let remains = devices;
    setTypes([...new Set(remains.map(x => x.type))]);

    if (type && type !== "") {
      remains = remains.filter(x => x.type === type);
      setBrands([...new Set(remains.map(x => x.brand))]);
    } else {
      setBrands(null);
      setBrand("");
      setMakes(null);
      setMake("");
      setModels(null);
      setModel("");
    }

    if (brand && brand !== "") {
      remains = remains.filter(x => x.brand === brand);
      setMakes([...new Set(remains.map(x => x.make))]);
    } else {
      setMakes(null);
      setMake("");
      setModels(null);
      setModel("");
    }

    if (make && make !== "") {
      remains = remains.filter(x => x.make === make);
      setModels([...new Set(remains.map(x => x.model))]);
    } else {
      setModels(null);
      setModel("");
    }

    setSerials(remains.map(x => x.serial_number));
  }, [devices, type, brand, make, model]);

  useEffect(() => {
    if (!serial) return;
    const device = devices.find(x => x.serial_number === serial);

    if (!device) {
      console.error("Could not find device.", serial, devices);
      alert("Something went wrong.");
      return;
    }

    setType(device.type)
    setBrand(device.brand);
    setMake(device.make);
    setModel(device.model);

    setDevice(device);
  }, [serial, devices]);

  const toLocalDateInput = (date) => {
    const pad = (n) => n.toString().padStart(2, '0');

    const yyyy = date.getFullYear();
    const MM = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const mm = pad(date.getMinutes());

    return `${yyyy}-${MM}-${dd}T${hh}:${mm}`;
  }

  const toggleUnassign = () => {
    const update = !removeDev;

    setRemoveDev(update);

    if (update) {
      setLocation("");
      setType("");
      setBrand("");
      setMake("");
      setModel("");

      setDevices(null);
      setTypes(null);
      setBrands(null);
      setMakes(null);
      setModels(null);
      setSerials(null);
    }
  }

  const formatter = (date) => {
    const options = {
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    };

    const formatter = new Intl.DateTimeFormat("en-US", options);

    const parts = formatter.formatToParts(date);
    const dateStr = parts.filter(p => ["weekday", "month", "day", "year"].includes(p.type)).map(p => p.value).join(" ");
    const timeStr = parts.filter(p => ["hour", "minute"].includes(p.type)).map(p => p.value).join(":").toLowerCase() + " " + parts.find(x => x.type === "dayPeriod").value;

    return `${dateStr} ${timeStr}`;
  }

  const updateRequest = async () => {
    const id = selectedRequest.borrow_id;

    if (!id || typeof id !== "number") {
      console.error("Something is wrong with the request object.", selectedRequest);
      alert("Something went wrong!");
      return;
    }

    try {
      const payload = {
        borrow_status: status.replace(" ", "_"),
        device_return_condition: retState ?? undefined,
        device_id: removeDev ? null : device?.device_id ?? undefined,
        return_date: !retDate || retDate === "" ? undefined : new Date(retDate),
        device_usage: devUsage
      };

      const response = await fetch(`/api/borrow/update/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
        headers: [["Content-Type", "application/json"]]
      });

      if (!response.ok) {
        console.error(response, await response.text());
        alert("Something went wrong!");
        return;
      }

      const data = await response.json();

      const update = {
        borrow_id: data.borrow_id,
        user_id: data.user?.user_id ?? "DELETED",
        borrow_status: data.borrow_status?.replace("_", " ") ?? "",
        name: data.user ? data.user.first_name + " " + data.user.last_name : "DELETED",
        borrow_date: new Date(data.borrow_date).toDateString(),
        return_date: data.return_date ? formatter(new Date(data.return_date)) : "Not Set",
        location_nickname: data.device?.location?.location_nickname ?? "Not set",
        device: data.device ? `${data.device.brand} ${data.device.make} ${data.device.model} (${data.device.type})` : "Not set",
        device_serial_number: data.device?.serial_number ?? ""
      }

      setSelectedRequest(update);
    } catch (error) {
      console.error("Something is wrong.", error, selectedRequest);
      alert("Failed to make a request.");
    }
  }

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      contentClassName="custom-modal"
    >
      <Modal.Header closeButton className="modal-header-custom">
        <Modal.Title className="modal-title-custom pb-0">
          <h5 className="fw-bold fs-2 w-100 text-center mb-0">{selectedRequest.name} ({selectedRequest.borrow_status})</h5>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body-custom pt-0">
        {selectedRequest && (
          <div className="">
            <div className="fw-normal fs-5">
              <h5 className="fw-bold w-100 text-center fs-3">Info</h5>
              {!selectedRequest.verified && (
                <div className="bg-warning text-black rounded-2 text-center w-auto">
                  <h4 className="fs-4 fw-bold mb-0">Warning!</h4>
                  <p className="fs-5">This user is not verified!</p>
                </div>
              )}
              <table className="mx-auto w-auto mb-2 ">
                <tbody>
                  <tr>
                    <td className="align-top pe-5 fw-bold text-end">Picking up: </td>
                    <td>
                      {selectedRequest.device}
                      <br />
                      {selectedRequest.device_serial_number}
                    </td>
                  </tr>
                  <tr>
                    <td className="fw-bold text-end pe-5">From:</td>
                    <td>{selectedRequest.location_nickname}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold text-end pe-5">On:</td>
                    <td>{selectedRequest.borrow_date.toString()}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold text-end pe-5">Return date:</td>
                    <td>{selectedRequest.return_date}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div>
              <h5 className="fw-bold fs-4 text-center mb-0">Update Request</h5>
              <Form className="mb-3 d-flex flex-column gap-2">
                <div>
                  <Form.Label className="fs-5 text-start mb-0">Status</Form.Label>
                  <Form.Select
                    className="border-0 bg-white text-black"
                    value={status}
                    onChange={x => {
                      setStatus(x.target.value);
                      if (x.target.value === "Checked_in") setRetDate(toLocalDateInput(new Date(Date.now())));
                    }}
                  >
                    <option value={"Submitted"}>Submitted</option>
                    <option value={"Scheduled"}>Scheduled</option>
                    <option value={"Checked_out"}>Checked Out</option>
                    <option value={"Checked_in"}>Checked In</option>
                    <option value={"Late"}>Late</option>
                    <option value={"Cancelled"}>Cancelled</option>
                  </Form.Select>
                </div>
                {status === "Checked_in" && (
                  <div>
                    <div>
                      <Form.Label className="fs-5 text-start mb-0">Device return condition</Form.Label>
                      <Form.Control type="text" className="ph bg-white text-black w-100 fs-6 p-2 rounded-2"
                        placeholder="Device return state" value={retState} onChange={x => setRetState(x.target.value)} />
                    </div>
                    <div>
                      <Form.Label className="fs-5 text-start mb-0">Device usage</Form.Label>
                      <Form.Control type="number" className="ph bg-white text-black w-100 fs-6 p-2 rounded-2"
                        placeholder="Device usage" value={devUsage} onChange={x => setDevUsage(x.target.value)} />
                    </div>
                  </div>
                )}
                <div>
                  <Form.Label className="fs-5 text-start mb-0">{status === "Checked_in" ? "Returned " : "Return By"}</Form.Label>
                  <Form.Control type="datetime-local" className="bg-white text-black"
                    value={retDate} onChange={x => setRetDate(x.target.value)} disabled={status === "Checked_in"}
                  />
                </div>
              </Form>
            </div>
            {!["Checked_out", "Cancelled", "Checked_in"].includes(status.replace(' ', '_')) && (
              <div>
                <Form className="d-flex flex-column gap-2">
                  <div className="d-flex w-100 justify-content-between">
                    <h5 className="fw-bold d-flex align-items-center m-0 fs-5">Reassign Device</h5>
                    <Button
                      className={`border-0 ${removeDev ? "bg-danger " : ""}`}
                      onClick={toggleUnassign}>
                      Un-Assign
                    </Button>
                  </div>
                  {locations && (
                    <Form.Select className="border-0 bg-white text-black" disabled={removeDev}
                      value={location} onChange={x => setLocation(x.target.value)}>
                      <option value={""}>Choose Location</option>
                      {locations.map((x, k) => (
                        <option value={x.location_id} key={k}>{x.location_nickname}</option>
                      ))}
                    </Form.Select>
                  )}
                  {types && (
                    <Form.Select className="border-0 bg-white text-black" value={type} onChange={x => setType(x.target.value)}>
                      <option value={""}>Choose Type</option>
                      {types.map((x, k) => (
                        <option value={x} key={k}>{x}</option>
                      ))}
                    </Form.Select>
                  )}
                  {brands && (
                    <Form.Select className="border-0 bg-white text-black" value={brand} onChange={x => setBrand(x.target.value)}>
                      <option value={""}>Choose Brand</option>
                      {brands.map((x, k) => (
                        <option value={x} key={k}>{x}</option>
                      ))}
                    </Form.Select>
                  )}
                  {makes && (
                    <Form.Select className="border-0 bg-white text-black" value={make} onChange={x => setMake(x.target.value)}>
                      <option value={""}>Choose Make</option>
                      {makes.map((x, k) => (
                        <option value={x} key={k}>{x}</option>
                      ))}
                    </Form.Select>
                  )}
                  {models && (
                    <Form.Select className="border-0 bg-white text-black" value={model} onChange={x => setModel(x.target.value)}>
                      <option value={""}>Choose Model</option>
                      {models.map((x, k) => (
                        <option value={x} key={k}>{x}</option>
                      ))}
                    </Form.Select>
                  )}
                  {serials && (
                    <Form.Select className="border-0 bg-white text-black" value={serial} onChange={x => setSerial(x.target.value)}>
                      <option value={""}>Pick a Device</option>
                      {serials.map((x, k) => (
                        <option value={x} key={k}>{x}</option>
                      ))}
                    </Form.Select>
                  )}
                </Form>
              </div>
            )}
            <div>
            </div>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="modal-footer-custom">
        <Button className="modal-btn" onClick={updateRequest}>Update</Button>
        <Button className="modal-btn" onClick={handleClose}>Cancel</Button>
      </Modal.Footer>
    </Modal>
  )
}

