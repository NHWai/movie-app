import { Button, Stack, TextField } from "@mui/material";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FormLayout } from "../components/FormLayout";
import { MyContext } from "../components/MyProvider";

type AddCastType = {
  [key: string]: string;
};

const initialCast: AddCastType = {
  protagonist: "",
  allie_rival: "",
};

export const AddCast = () => {
  const { token } = React.useContext(MyContext);
  const navigate = useNavigate();
  const [cast, setCast] = React.useState<AddCastType>(initialCast);
  const { movieId } = useParams();

  const handleClick = () => {
    const newCast: AddCastType = initialCast;
    for (let key in cast) {
      newCast[key] = cast[key].trim();
    }
    if (token.tokenStr) {
      addCast(newCast, token.tokenStr);
    } else {
      setCast(initialCast);
      navigate("/login");
    }
  };

  const addCast = async (castObj: AddCastType, tokenid: string) => {
    const url = `${process.env.REACT_APP_BASE_URL}/casts`;
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${tokenid}`);
    myHeaders.append("Content-Type", "Application/json");
    const raw = JSON.stringify({
      movie: movieId,
      protagonist: castObj.protagonist,
      allie_rival: castObj.allie_rival,
    });
    const res = await fetch(url, {
      method: "POST",
      headers: myHeaders,
      body: raw,
    });
    const data = await res.json();
    if (res.status) {
      const movieId = data.data.movie;
      navigate(`/movie/${movieId}`);
    }
  };

  const helpTextFunc = (str: string): string => {
    if (str.trim() === "") {
      return `can't be empty`;
    }
    return " ";
  };

  const validate = (str: string): boolean => {
    if (str.trim() === "") {
      return false;
    }
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCast((pre) => {
      return {
        ...pre,
        [e.target.name]: e.target.value,
      };
    });
  };

  return (
    <FormLayout>
      <Stack spacing={2}>
        <Stack spacing={1}>
          <TextField
            label="protagonist"
            name="protagonist"
            variant="standard"
            required
            value={cast.protagonist}
            helperText={helpTextFunc(cast.protagonist)}
            onChange={handleChange}
          />
          <TextField
            label="allie_rival"
            name="allie_rival"
            variant="standard"
            required
            value={cast.allie_rival}
            helperText={helpTextFunc(cast.allie_rival)}
            onChange={handleChange}
          />
        </Stack>
        <Stack direction={"row-reverse"}>
          <Button
            disabled={
              validate(cast.protagonist) && validate(cast.allie_rival)
                ? false
                : true
            }
            onClick={handleClick}
            variant="contained"
          >
            Submit
          </Button>
        </Stack>
      </Stack>
    </FormLayout>
  );
};
