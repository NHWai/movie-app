import { Button, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  ReviewInputType,
  getReviewsByMovieId,
  selectReviews,
  uploadReview,
} from "../features/reviews/reviewsSlice";

interface ReviewInputProps {
  movieId: string;
  tokenStr: string;
  userId: string;
  username: string;
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
}: ReviewInputProps) => {
  const [formData, setFormData] = useState<Review>(initialReview);
  const [errMsg, setErrMsg] = useState<Review>(initialReview);
  const [isLoad, setIsLoad] = useState(false);

  const navigate = useNavigate();
  const reviews = useAppSelector(selectReviews);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (reviews.status === "failed") {
      navigate(`/error`, { state: { errMsg: reviews.errMsg } });
    } else if (reviews.status === "idle") {
      setIsLoad(false);
      setFormData(initialReview);
    }
  }, [reviews.status]);

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
      case "comment":
        if (!inputValue.length) {
          error = `can't be empty`;
        }
        setErrMsg((pre) => {
          return {
            ...pre,
            comment: error,
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

  // const uploadReview = async (
  //   formData: Review,
  //   movieId: string,
  //   tokenStr: string,
  //   userId: string,
  //   username: string
  // ) => {
  //   const url = `${process.env.REACT_APP_BASE_URL}/reviews/${movieId}`;
  //   const myHeaders = new Headers();
  //   myHeaders.append("Authorization", `Bearer ${tokenStr}`);
  //   myHeaders.append("Content-type", "application/json");

  //   const raw = JSON.stringify({
  //     ...formData,
  //     userId,
  //     username,
  //   });

  //   try {
  //     const res = await fetch(url, {
  //       method: "POST",
  //       headers: myHeaders,
  //       body: raw,
  //       redirect: "follow",
  //     });

  //     if (res.status === 201) {
  //       const data = await res.json();
  //       console.log(data);
  //       setIsLoad(false);
  //       setFormData(initialReview);
  //     } else if (res.status === 401) {
  //       navigate("/login");
  //     } else {
  //       throw Error(`can't add the review`);
  //     }
  //   } catch (err) {
  //     navigate(`/error/${err}`);
  //   }
  // };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoad(true);
    const reviewInput: ReviewInputType = {
      ...formData,
      rating: Number(formData.rating),
      _id: "",
      movieId,
      userId,
      username,
      tokenStr,
    };
    dispatch(uploadReview(reviewInput));
    // uploadReview(formData, movieId, tokenStr, userId, username);
  };
  // --> true
  const isDisable =
    Object.values(errMsg).some((el) => el !== "") ||
    Object.values(formData).some((el) => el === "") ||
    isLoad;

  return (
    <Box
      sx={{
        maxWidth: "800px",
        padding: "1.5rem",
        borderRadius: "0.3rem",
        boxShadow: "0 2px 3px 0",
        transition: "0.3s",
        "&:hover": { boxShadow: "0 4px 8px 0" },
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
          autoComplete="off"
        />
        <TextField
          label="give your comment"
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
          disabled={isDisable}
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
