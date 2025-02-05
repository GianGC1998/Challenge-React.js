import { yupResolver } from "@hookform/resolvers/yup";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import LoopIcon from "@mui/icons-material/LoopOutlined";
import {
  Alert,
  Box,
  Button,
  Divider,
  InputAdornment,
  TextField,
} from "@mui/material";
import { FC, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { paths } from "../../common/constants/paths.constants";
import { Layout } from "../../components/Layout/Layout";
import { useAuth } from "../../providers/auth/auth.hook";
import { useNotification } from "../../providers/notification/notification.hook";
import { RegisterVariables } from "../../providers/user/types";
import { withRegisterProvider } from "../../providers/user/user.hoc";
import { useUser } from "../../providers/user/user.hook";
import { validationSchema } from "./Register.validation";

const Register: FC = () => {
  const navigate = useNavigate();
  const [{ authenticated }] = useAuth();
  const { sendNotification } = useNotification();
  const [
    { registerUser, registerUserError, registerUserLoading },
    { register: registerUserFn },
  ] = useUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterVariables>({ resolver: yupResolver(validationSchema) });

  useEffect(() => {
    if (authenticated) {
      navigate(paths.UNIVERSITY.SEARCH);
    }
  }, [authenticated, navigate]);

  const onSubmit = useCallback(
    (values: RegisterVariables) => {
      registerUserFn(values);
    },
    [registerUserFn]
  );

  useEffect(() => {
    if (registerUser) {
      sendNotification("Registration successfull!", "success");
      navigate(paths.LOGIN);
    }
  }, [registerUser, navigate]);

  return (
    <Layout>
      <Box
        sx={{
          maxWidth: 548,
          padding: "24px 16px",
          background: "white",
          boxShadow:
            "0px 6px 12px rgba(0, 0, 0, 0.06), 0px 12px 18px rgba(0, 0, 0, 0.1)",
          borderRadius: 1,
        }}
      >
        {registerUserError && (
          <Alert severity="error">{registerUserError}</Alert>
        )}
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            error={Boolean(errors.name?.message)}
            label="Name"
            helperText={errors.name?.message ?? ""}
            InputProps={{
              endAdornment: <InputAdornment position="end">*</InputAdornment>,
            }}
            fullWidth
            sx={{
              marginTop: 2.5,
            }}
            {...register("name")}
          />
          <TextField
            error={Boolean(errors.email?.message)}
            label="Email"
            helperText={errors.email?.message ?? ""}
            InputProps={{
              endAdornment: <InputAdornment position="end">*</InputAdornment>,
            }}
            fullWidth
            sx={{
              marginTop: 2.5,
            }}
            {...register("email")}
          />
          <TextField
            error={Boolean(errors.password?.message)}
            label="Password"
            helperText={errors.password?.message ?? ""}
            InputProps={{
              endAdornment: <InputAdornment position="end">*</InputAdornment>,
            }}
            fullWidth
            type="password"
            sx={{
              marginTop: 2.5,
            }}
            {...register("password")}
          />
          <TextField
            error={Boolean(errors.confirmPassword?.message)}
            label="Confirm Password"
            helperText={errors.confirmPassword?.message ?? ""}
            InputProps={{
              endAdornment: <InputAdornment position="end">*</InputAdornment>,
            }}
            fullWidth
            type="password"
            sx={{
              marginTop: 2.5,
            }}
            {...register("confirmPassword")}
          />
          <Button
            sx={{
              marginTop: 2.5,
            }}
            variant="contained"
            fullWidth
            type="submit"
            size="large"
            disabled={registerUserLoading}
            endIcon={!registerUserLoading ? <ArrowForwardIcon /> : <LoopIcon />}
          >
            Register
          </Button>
          <Divider
            sx={{
              marginTop: 2.5,
            }}
          >
            o
          </Divider>
          <Button
            sx={{
              marginTop: 2.5,
            }}
            variant="outlined"
            fullWidth
            size="large"
            disabled={registerUserLoading}
            onClick={() => navigate(paths.LOGIN)}
          >
            Login
          </Button>
        </form>
      </Box>
    </Layout>
  );
};

export default withRegisterProvider(Register);
