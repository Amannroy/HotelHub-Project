import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  TablePagination,
  Avatar,
  IconButton,
  Tooltip,
  useMediaQuery,
  Box,
  Button,
} from "@mui/material";
// Icons used for actions
import { Edit, Delete, Add } from "@mui/icons-material";

// Used to access MUI theme (breakpoints, colors, etc.)
import { useTheme } from "@mui/material/styles";

// Toast notifications for errors
import { toast } from "react-toastify";

// Custom styled components (your own styles)
import {
  StyledPaper,
  StyledTableHeader,
  StyledHeaderCell,
  AnimatedTableRow,
  PositionChip,
  colors,
} from "./styles";

// Modals for adding, Editing & deleting team members
import AddTeamModal from "./AddTeamModal";
import DeleteTeamModal from "./DeleteTeamModal";
import EditTeamModal from "./EditTeamModal";

export default function TeamTable() {
  // Pagination state
  const [page, setPage] = useState(0); // current page number
  const [rowsPerPage, setRowsPerPage] = useState(5); // rows per page

  // Access MUI theme
  const theme = useTheme();

  // Detect small screen (mobile)
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  // Modal and UI state
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  // Used to disable buttons while API calls are running
  const [loading, setLoading] = useState(false);

  // Stores the selected employee (for delete/edit)
  const [currentMember, setCurrentMember] = useState(null);

  // Main data: list of employees fetched from backend
  const [employees, setEmployees] = useState([]);

  const [openEditModal, setOpenEditModal] = useState(false);

  // Runs ONCE when component mounts
  // Used to fetch team members from backend
  useEffect(() => {
    fetchEmployees();
  }, []);

  // Fetch employees from backend API
  const fetchEmployees = async () => {
    try {
      setLoading(true); // disable UI while loading

      const response = await fetch(`${process.env.API}/admin/team`);
      const data = await response.json();

      // Save backend data into state
      setEmployees(data);
    } catch (error) {
      toast.error("Failed to fetch team member");
    } finally {
      setLoading(false); // re-enable UI
    }
  };

  // When delete button is clicked
  // Store selected employee & open delete modal
  const handleDeleteClick = (employee) => {
    setCurrentMember(employee);
    setOpenDeleteModal(true);
  };

  const handleEditClick = (employee) => {
    setCurrentMember(employee);
    setOpenEditModal(true);
  };

  const handleEditSuccess = (updatedMember) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp._id === updatedMember._id ? updatedMember : emp)),
    );

    setOpenEditModal(false);
  };

  // Called after successfully adding a new member
  // Adds new member to existing list (no refetch)
  const handleAddSuccess = (newMember) => {
    setEmployees((prev) => [...prev, newMember]);
    setOpenAddModal(false);
  };

  // Called after successful deletion
  // Removes deleted member from state
  const handleDeleteSuccess = (deletedId) => {
    setEmployees((prev) => prev.filter((emp) => emp._id !== deletedId));
    setOpenDeleteModal(false);
  };

  // Pagination page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // reset to first page
  };

  return (
    <>
      <StyledPaper sx={{ width: "100%", p: isSmallScreen ? 1 : 3 }}>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenAddModal(true)}
            sx={{
              backgroundColor: "#8A12FC",
              "&:hover": { backgroundColor: "#7a0eeb" },
            }}
            disabled={loading}
          >
            Add Team Member
          </Button>
        </Box>

        <TableContainer
          sx={{
            maxHeight: "70vh",
            borderRadius: "12px",
            "&::-webkit-scrollbar": {
              width: "6px",
              height: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(102,126,234,0.5)",
              borderRadius: "4px",
            },
          }}
        >
          <Table
            stickyHeader
            aria-label="modern employee table"
            size={isSmallScreen ? "small" : "medium"}
          >
            <StyledTableHeader>
              <TableRow>
                {!isSmallScreen && <StyledHeaderCell>Profile</StyledHeaderCell>}
                <StyledHeaderCell>Name</StyledHeaderCell>
                <StyledHeaderCell>Position</StyledHeaderCell>
                <StyledHeaderCell>Actions</StyledHeaderCell>
              </TableRow>
            </StyledTableHeader>
            <TableBody>
              {employees &&
                employees
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((employee) => (
                    <AnimatedTableRow
                      key={employee?._id}
                      hover
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {!isSmallScreen && (
                        <TableCell>
                          <Avatar
                            src={employee.image}
                            alt={employee.name}
                            sx={{
                              width: 56,
                              height: 56,
                              border: "3px solid white",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                            }}
                          />
                        </TableCell>
                      )}
                      <TableCell
                        sx={{
                          fontWeight: "700",
                          color: "#2d3748",
                          fontSize: isSmallScreen ? "14px" : "16px",
                          padding: isSmallScreen ? "8px" : "16px",
                        }}
                      >
                        {employee.name}
                      </TableCell>
                      <TableCell>
                        <PositionChip
                          position={employee.position}
                          label={
                            isSmallScreen
                              ? employee.position.split(" ").pop()
                              : employee.position
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Box
                          sx={{
                            display: "flex",
                            gap: isSmallScreen ? "4px" : "8px",
                          }}
                        >
                          <Tooltip title="Edit">
                            <IconButton
                              onClick={() => handleEditClick(employee)}
                              sx={{ color: colors.edit }}
                              size={isSmallScreen ? "small" : "medium"}
                              disabled={loading}
                            >
                              <Edit
                                fontSize={isSmallScreen ? "small" : "medium"}
                              />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              onClick={() => handleDeleteClick(employee)}
                              sx={{ color: colors.delete }}
                              size={isSmallScreen ? "small" : "medium"}
                              disabled={loading}
                            >
                              <Delete
                                fontSize={isSmallScreen ? "small" : "medium"}
                              />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </AnimatedTableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={isSmallScreen ? [5, 10] : [5, 10, 25]}
          component="div"
          count={employees?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
              {
                color: "#4a5568",
                fontWeight: "600",
                fontSize: isSmallScreen ? "12px" : "14px",
              },
            "& .MuiSvgIcon-root": {
              color: "#667eea",
            },
          }}
        />
      </StyledPaper>

      <AddTeamModal
        open={openAddModal}
        onClose={() => setOpenAddModal(false)}
        onSuccess={handleAddSuccess}
        loading={loading}
        setLoading={setLoading}
      />

      <EditTeamModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        member={currentMember}
        onSuccess={handleEditSuccess}
        loading={loading}
        setLoading={setLoading}
      />

      <DeleteTeamModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        member={currentMember}
        onSuccess={handleDeleteSuccess}
        loading={loading}
        setLoading={setLoading}
      />
    </>
  );
}
