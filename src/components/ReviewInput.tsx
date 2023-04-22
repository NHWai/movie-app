import { Button, TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ReviewInputProps {
  movieId: string;
  tokenStr: string;
  userId: string;
  username: string;
  setIsSubmit: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Review {
  rating: string;
  comment: string;
}

const initialReview: Review = {
  rating: "",
  comment: "",
};

export const ReviewInput = ({
  movieId,
  tokenStr,
  userId,
  username,
  setIsSubmit,
}: ReviewInputProps) => {
  const [formData, setFormData] = useState<Review>(initialReview);
  const [errMsg, setErrMsg] = useState<Review>(initialReview);
  const [isLoad, setIsLoad] = useState(false);
  const navigate = useNavigate();

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setErrMsg((pre) => {
      return {
        ...pre,
        [e.target.name]: "",
      };
    });
  };

  const validate = (inputName: string, inputValue: string) => {
    let error = "";
    switch (inputName) {
      case "rating":
        if (!/^[1-9]\d*(\.\d+)?$/.test(inputValue)) {
          error = `Invalid Input`;
        } else if (Number(inputValue) > 5) {
          error = "not greater than 5";
        } else {
          error = "";
        }
        setErrMsg((pre) => {
          return {
            ...pre,
            rating: error,
          };
        });
        break;
      case "review":
        if (!inputValue.length) {
          error = `can't be empty`;
        }
        setErrMsg((pre) => {
          return {
            ...pre,
            review: error,
          };
        });
        break;
      default:
        break;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((obj) => {
      return {
        ...obj,
        [e.target.name]: e.target.value,
      };
    });
  };

  const uploadReview = async (
    formData: Review,
    movieId: string,
    tokenStr: string,
    userId: string,
    username: string
  ) => {
    const url = `${process.env.REACT_APP_BASE_URL}/reviews/${movieId}`;
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${tokenStr}`);
    myHeaders.append("Content-type", "application/json");

    const raw = JSON.stringify({
      ...formData,
      userId,
      username,
    });

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      });

      if (res.status === 201) {
        const data = await res.json();
        console.log(data);
        setIsLoad(false);
        setFormData(initialReview);
        setIsSubmit(true);
      } else if (res.status === 401) {
        navigate("/login");
      } else {
        throw Error(`can't add the review`);
      }
    } catch (err) {
      navigate(`/error/${err}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoad(true);
    uploadReview(formData, movieId, tokenStr, userId, username);
  };

  return (
    <Box
      sx={{
        // backgroundColor: "rgb(128, 152, 191)",
        maxWidth: "800px",
        padding: "1.5rem",
        borderRadius: "0.3rem",
        boxShadow: "0 2px 4px 0 rgba(0,0,0,0.2)",
        transition: "0.3s",
        "&:hover": { boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)" },
      }}
    >
      <form onSubmit={handleSubmit}>
        <TextField
          sx={{ mb: 2 }}
          label="rating"
          variant="standard"
          fullWidth
          name="rating"
          error={Boolean(errMsg.rating)}
          value={formData.rating}
          helperText={errMsg.rating}
          onFocus={handleFocus}
          onBlur={(e) => validate(e.target.name, e.target.value)}
          onChange={handleChange}
        />
        <TextField
          label="give some review"
          variant="standard"
          multiline
          maxRows={4}
          fullWidth
          sx={{ mb: 2 }}
          name="comment"
          error={Boolean(errMsg.comment)}
          value={formData.comment}
          helperText={errMsg.comment}
          onFocus={handleFocus}
          onBlur={(e) => validate(e.target.name, e.target.value)}
          onChange={handleChange}
        />
        <Button
          disabled={isLoad}
          type="submit"
          sx={{ marginLeft: "auto", display: "block" }}
          variant="outlined"
          size="small"
        >
          {isLoad ? "Loading" : "Submit"}
        </Button>
      </form>
    </Box>
  );
};
