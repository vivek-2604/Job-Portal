import mongoose from "mongoose";
import jobModel from "../models/jobModel.js";
import moment from "moment";

export const createJobController = async (req, res, next) => {
  const { company, position } = req.body;
  if (!company || !position) {
    next("Provide All Field");
  }

  req.body.createdBy = req.user.userId;
  const job = await jobModel.create(req.body);
  res.status(201).json({ job });
};

export const getJobController = async (req, res, next) => {
  const { status, workType, search, sort } = req.query;
  //conditons for searching filters
  const queryObject = {
    createdBy: req.user.userId,
  };
  
  //logic filters
  if (status && status !== "all") {
    queryObject.status = status;
  }
  if (workType && workType !== "all") {
    queryObject.workType = workType;
  }
  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }

  let queryResult = jobsModel.find(queryObject);

  //sorting
  if (sort === "latest") {
    queryResult = queryResult.sort("-createdAt");
  }
  if (sort === "oldest") {
    queryResult = queryResult.sort("createdAt");
  }
  if (sort === "a-z") {
    queryResult = queryResult.sort("position");
  }
  if (sort === "z-a") {
    queryResult = queryResult.sort("-position");
  }
  
  //pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  queryResult = queryResult.skip(skip).limit(limit);
  
  //jobs count
  const totalJobs = await jobsModel.countDocuments(queryResult);
  const numOfPage = Math.ceil(totalJobs / limit);

  const jobs = await queryResult;

  res.status(200).json({
    totalJobs,
    jobs,
    numOfPage
  });
};

export const updateJobController = async (req, res, next) => {
  const { id } = req.params;

  const { position, company } = req.body;
  if (!position || !company) {
    next("Provide all Fields");
  }

  const job = await jobModel.findOne({ _id: id });
  if (!job) {
    next("No Job is found!!");
  }

  if (!req.user.userId === job.createdBy.toString()) {
    next("you are not authorised to update this job");
    return;
  }

  const updateJob = await jobModel.findByIdAndUpdate({ _id: id }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    updateJob,
  });
};

export const deleteJobController = async (req, res, next) => {
  const { id } = req.params;

  const job = await jobModel.findOne({ _id: id });
  if (!job) {
    next("No Job is found!!");
  }

  if (!req.user.userId === job.createdBy.toString()) {
    next("you are not authorised to update this job");
    return;
  }

  await job.deleteOne();
  res.status(200).json({
    message: "Success, Job Deleted!",
  });
};

export const jobStatsController = async (req, res) => {
  const stats = await jobModel.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },
    },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  let monthlyApplication = await jobModel.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },
    },
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        count: {
          $sum: 1,
        },
      },
    },
  ]);
  monthlyApplication = monthlyApplication
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");
      return { date, count };
    })
    .reverse();

  const defaultStats = {
    pending: stats.pending || 0,
    reject: stats.reject || 0,
    interview: stats.interview || 0,
  };

  

  res.status(200).json({ totalJobs: stats.length, defaultStats, monthlyApplication });
};
