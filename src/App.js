import react from 'react';
import { useEffect, useState } from "react";
import './App.css';
import axios from 'axios';
import {
  Box,
  Button,
  Checkbox,
  Modal,
  Pagination,
  TextField,
} from "@mui/material";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";

function App() {
  // API declaration
  let URL =
    "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json";
  // API declaration ends here

  // Data storing
  const [data, setData] = useState();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const apiCall = async () => {
      try {
        let response = await axios.get(URL);
        console.log(response.data);
        setData(response.data);
        setRows(
          response.data.map((e, i) => ({
            id: i + 1,
            name: e.name,
            email: e.email,
            role: e.role,
          }))
        );
      } catch (error) {
        console.error(error, "error");
      }
    };
    apiCall();
  }, []);

  //search bar

  const [searchValue, setSearchValue] = useState("");

  let filteredRows = rows.filter(
    (event) =>
      event.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      event.email.toLowerCase().includes(searchValue.toLowerCase()) ||
      event.role.toLowerCase().includes(searchValue.toLowerCase())
  );

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const totalRows = rows.length;
 
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;

  const currentRows = filteredRows.slice(startIndex, endIndex);

  //pagination as per filter

  const filteredTotalPages = Math.ceil(filteredRows.length / rowsPerPage);

  const totalPages =
    filteredTotalPages <= totalRows ? filteredTotalPages : totalRows;

  // rows selection

  const [selectedRows, setSelectedRows] = useState([]);

  let handleCheckBox = (event, id) => {
    if (event.target.checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter((e) => e !== id));
    }
  };

  // header checkedbox

  const [headerCheckboxState, setHeaderCheckboxState] = useState(false);
  const [allRowsSelected, setAllRowsSelected] = useState(false);

  useEffect(() => {
    setAllRowsSelected(false);
  }, [currentPage]);

  //delete selection

  const handleDelete = () => {
    const updatedRows = rows.filter((row) => !selectedRows.includes(row.id));
    setRows(updatedRows);
    setSelectedRows([]);
  };

  // modal

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    backgroundColor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    borderRadius: 2,
  };
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  //edit the row using modal

  const [selectedRowModal, setSelectedRowModal] = useState(null);
  const handleOpenModal = (id) => {
    const selectedRowinModal = rows.find((row) => row.id === id);
    setSelectedRowModal(selectedRowinModal);
    setOpen(true);
  };

  const handleSave = () => {
    const updatedRowsInModal = rows.map((row) => {
      if (row.id === selectedRowModal.id) {
        return {
          ...row,
          name: selectedRowModal.name,
          email: selectedRowModal.email,
          role: selectedRowModal.role,
        };
      } else {
        return row;
      }
    });
    setRows(updatedRowsInModal);
    setSelectedRowModal(null);
    setOpen(false);
  };

  return (
    <div className="App" style={{ width: "100%" }}>
      <TextField
        label="Search by name, email or role"
        variant="outlined"
        sx={{ width: "100%", marginBottom: "20px" }}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <div
        style={{
          width: "100%",
          height: "650px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <table className="table" style={{ flex: "1" }}>
          <thead>
            <tr>
              <th scope="#">
                <Checkbox
                  checked={headerCheckboxState}
                  onChange={(event) => {
                    setHeaderCheckboxState(event.target.checked);
                    setSelectedRows(
                      event.target.checked
                        ? currentRows.map((row) => row.id)
                        : []
                    );
                    setAllRowsSelected(event.target.checked);
                  }}
                />
              </th>
              <th scope="col#">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Role</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentRows.map((e) => {
              return (
                <tr
                  key={e.id}
                  style={{
                    backgroundColor: selectedRows.includes(e.id)
                      ? "grey"
                      : "white",
                  }}
                >
                  <td>
                    <Checkbox
                      key={e.id}
                      onChange={(event) => {
                        handleCheckBox(event, e.id);
                        if (allRowsSelected) {
                          setAllRowsSelected(false);
                          setHeaderCheckboxState(false);
                        }
                      }}
                      checked={allRowsSelected || selectedRows.includes(e.id)}
                    />
                  </td>
                  <td>{e.name}</td>
                  <td>{e.email}</td>
                  <td>{e.role}</td>
                  <td>
                    <Button
                      sx={{ color: "#000", margin: "0" }}
                      onClick={() => handleOpenModal(e.id)}
                    >
                      <BorderColorOutlinedIcon />
                    </Button>

                    <Modal
                      open={open}
                      onClose={handleClose}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <Box sx={style}>
                        <TextField
                          label="Name"
                          variant="outlined"
                          sx={{ margin: "10px" }}
                          value={selectedRowModal?selectedRowModal.name:''}
                          onChange={(e) =>
                            setSelectedRowModal({
                              ...selectedRowModal,
                              name: e.target.value,
                            })
                          }
                        />
                        <TextField
                          label="Email"
                          variant="outlined"
                          sx={{ margin: "10px" }}
                          value={selectedRowModal?selectedRowModal.email:''}
                          onChange={(e) =>
                            setSelectedRowModal({
                              ...selectedRowModal,
                              email: e.target.value,
                            })
                          }
                        />
                        <TextField
                          label="Role"
                          variant="outlined"
                          sx={{ margin: "10px" }}
                          value={selectedRowModal?selectedRowModal.role:''}
                          onChange={(e) =>
                            setSelectedRowModal({
                              ...selectedRowModal,
                              role: e.target.value,
                            })
                          }
                        />
                        <div>
                          <Button
                            variant="contained"
                            onClick={handleClose}
                            sx={{ margin: "10px" }}
                          >
                            Cancel
                          </Button>
                          <Button
                            variant="contained"
                            onClick={handleSave}
                          >
                            Save
                          </Button>
                        </div>
                      </Box>
                    </Modal>
                    <Button onClick={handleDelete}>
                      <DeleteOutlinedIcon sx={{ color: "red" }} />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flex: "0.1",
          }}
        >
          <Button
            variant="contained"
            color="error"
            sx={{ marginRight: "150px", textTransform: "none" }}
            onClick={handleDelete}
          >
            Delete Selected
          </Button>
          <div
            style={{ display: "flex", justifyContent: "center", flex: "0.9" }}
          >
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={(event, value) => setCurrentPage(value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
