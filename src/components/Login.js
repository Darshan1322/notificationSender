import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import "bootstrap/dist/css/bootstrap.min.css";

function Login() {
  const [data, setData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // loader state

  const login = async () => {
    if (!data.username.trim() || !data.password.trim()) {
      setError("Username and password are required.");
      return;
    }
    setLoading(true);
    try {
      setError("");
      const res = await axios.post(
        "http://localhost:8089/authservice/api/auth/login",
        data
      );
      localStorage.setItem("token", res.data.token);
      window.location.href = "/channels";
    } catch {
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <Box
        sx={{
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          width: 350,
          bgcolor: "background.paper",
          textAlign: "center",
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Username"
          variant="outlined"
          margin="normal"
          value={data.username}
          onChange={(e) => setData({ ...data, username: e.target.value })}
          disabled={loading}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          margin="normal"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
          disabled={loading}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={login}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
        </Button>
      </Box>
    </div>
  );
}

export default Login;
