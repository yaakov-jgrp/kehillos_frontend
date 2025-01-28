import React from "react";
import { Modal, Box, Typography, Select, MenuItem, Button } from "@mui/material";

const SearchFieldModal = ({ open, handleClose, searchField, setSearchField }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 300,
          bgcolor: "background.paper",
          border: "2px solid #000",
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography variant="h6" component="h2">
          Select Search Field
        </Typography>
        <Select
          value={searchField}
          onChange={(e) => setSearchField(e.target.value)}
          fullWidth
          sx={{ mt: 2 }}
        >
          <MenuItem value="id">ID</MenuItem>
          <MenuItem value="name">Name</MenuItem>
        </Select>
        <Button onClick={handleClose} variant="contained" sx={{ mt: 2 }}>
          Close
        </Button>
      </Box>
    </Modal>
  );
};

export default SearchFieldModal;