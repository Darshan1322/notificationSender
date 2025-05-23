import { useEffect, useState } from "react";
import axios from "axios";
import {
  Typography,
  CircularProgress,
  Box,
  List,
  ListItem,
  ListItemText,
  Paper,
} from "@mui/material";

export default function NotificationLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get("http://localhost:8089/authservice/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setLogs(res.data))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Notification Logs
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Paper elevation={3} sx={{ p: 2 }}>
          <List>
            {logs.map((log) => (
              <ListItem key={log.id} divider>
                <ListItemText
                  primary={`To: ${log.receiver} | Channel: ${log.channel}`}
                  secondary={`Status: ${log.status} | ${new Date(
                    log.timestamp
                  ).toLocaleString()}`}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}
