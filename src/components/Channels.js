import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  List,
  ListItem,
  ListItemText,
  Box,
  CircularProgress,
  Paper,
  Alert,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function Channels() {
  const [channels, setChannels] = useState([]);
  const [newChannel, setNewChannel] = useState({
    name: "",
    type: "Email",
    metadata: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submissionError, setSubmissionError] = useState("");
  const token = localStorage.getItem("token");

  // inside your component
  const fetchChannels = useCallback(() => {
    axios
      .get("http://localhost:8089/authservice/api/channels", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setChannels(res.data))
      .catch(() => setSubmissionError("Failed to fetch channels"))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    fetchChannels();
  }, []);

  const validate = () => {
    const err = {};
    if (!newChannel.name.trim()) err.name = "Name is required.";
    if (!newChannel.metadata.trim()) err.metadata = "Metadata is required.";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const saveChannel = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      setSubmissionError("");
      if (editingId) {
        await axios.put(
          `http://localhost:8089/authservice/api/channels/${editingId}`,
          newChannel,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("Channel Updated");
      } else {
        await axios.post(
          "http://localhost:8089/authservice/api/channels",
          newChannel,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        alert("Channel Created");
      }
      resetForm();
      fetchChannels();
    } catch (e) {
      setSubmissionError("Failed to save channel. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const deleteChannel = async (id) => {
    if (!window.confirm("Are you sure you want to delete this channel?"))
      return;
    try {
      await axios.delete(
        `http://localhost:8089/authservice/api/channels/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Channel Deleted");
      fetchChannels();
    } catch (e) {
      alert("Failed to delete channel");
    }
  };

  const editChannel = (channel) => {
    setNewChannel({
      name: channel.name,
      type: channel.type,
      metadata: channel.metadata,
    });
    setEditingId(channel.id);
  };

  const resetForm = () => {
    setNewChannel({ name: "", type: "Email", metadata: "" });
    setEditingId(null);
    setErrors({});
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Notification Channels
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
          <List>
            {channels.map((c) => (
              <ListItem
                key={c.id}
                divider
                secondaryAction={
                  <>
                    <IconButton edge="end" onClick={() => editChannel(c)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton edge="end" onClick={() => deleteChannel(c.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <ListItemText
                  primary={`${c.name} (${c.type})`}
                  secondary={c.metadata}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      <Typography variant="h5" gutterBottom>
        {editingId ? "Edit Channel" : "Create Channel"}
      </Typography>

      {submissionError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submissionError}
        </Alert>
      )}

      <Box
        component="form"
        sx={{ display: "flex", flexDirection: "column", gap: 2, width: 300 }}
      >
        <TextField
          label="Name"
          value={newChannel.name}
          onChange={(e) =>
            setNewChannel({ ...newChannel, name: e.target.value })
          }
          error={!!errors.name}
          helperText={errors.name}
        />
        <TextField
          label="Metadata"
          value={newChannel.metadata}
          onChange={(e) =>
            setNewChannel({ ...newChannel, metadata: e.target.value })
          }
          error={!!errors.metadata}
          helperText={errors.metadata}
        />
        <Select
          value={newChannel.type}
          onChange={(e) =>
            setNewChannel({ ...newChannel, type: e.target.value })
          }
        >
          <MenuItem value="Email">Email</MenuItem>
          <MenuItem value="In-App">In-App</MenuItem>
        </Select>
        <Button variant="contained" color="primary" onClick={saveChannel}>
          {editingId ? "Update" : "Create"}
        </Button>
        {editingId && (
          <Button variant="outlined" color="secondary" onClick={resetForm}>
            Cancel Edit
          </Button>
        )}
      </Box>
    </Box>
  );
}
