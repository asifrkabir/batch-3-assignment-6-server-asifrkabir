import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CommentService } from "./comment.service";

const getAllComments = catchAsync(async (req, res) => {
  const result = await CommentService.getAllComments(req.query);

  if (result?.result?.length <= 0) {
    sendResponse(res, {
      success: false,
      statusCode: httpStatus.OK,
      message: "No Data Found",
      meta: result.meta,
      data: result?.result,
    });
  } else {
    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: "Comments retrieved successfully",
      meta: result.meta,
      data: result.result,
    });
  }
});

const createComment = catchAsync(async (req, res) => {
  const { userId } = req.user;

  const result = await CommentService.createComment(userId, req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Comment created successfully",
    data: result,
  });
});

export const CommentController = {
  createComment,
  getAllComments,
};
