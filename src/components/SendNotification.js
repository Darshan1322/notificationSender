import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
  FormControl,
  InputLabel,
} from "@mui/material";

export default function SendNotification() {
  const [notification, setNotification] = useState({
    receiver: "",
    content: "",
    channel: "Email",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const validate = () => {
    if (!notification.receiver.trim()) {
      setError("Receiver is required");
      return false;
    }
    if (!notification.content.trim()) {
      setError("Content is required");
      return false;
    }
    setError("");
    return true;
  };

  const send = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      setError("");
      await axios.post(
        "http://localhost:8089/authservice/api/notifications",
        notification,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Notification Sent");
      setNotification({ receiver: "", content: "", channel: "Email" });
    } catch (e) {
      setError("Failed to send notification. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 4,
        p: 3,
        borderRadius: 2,
        boxShadow: 3,
        bgcolor: "background.paper",
      }}
    >
      <Typography variant="h4" mb={3} textAlign="center">
        Send Notification
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        label="Receiver"
        variant="outlined"
        margin="normal"
        value={notification.receiver}
        onChange={(e) =>
          setNotification({ ...notification, receiver: e.target.value })
        }
        disabled={loading}
      />

      <TextField
        fullWidth
        label="Content"
        variant="outlined"
        margin="normal"
        multiline
        minRows={3}
        value={notification.content}
        onChange={(e) =>
          setNotification({ ...notification, content: e.target.value })
        }
        disabled={loading}
      />

      <FormControl fullWidth margin="normal">
        <InputLabel id="channel-label">Channel</InputLabel>
        <Select
          labelId="channel-label"
          label="Channel"
          value={notification.channel}
          onChange={(e) =>
            setNotification({ ...notification, channel: e.target.value })
          }
          disabled={loading}
        >
          <MenuItem value="Email">Email</MenuItem>
          <MenuItem value="In-App">In-App</MenuItem>
        </Select>
      </FormControl>

      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={send}
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Send"}
      </Button>
    </Box>
  );
}
