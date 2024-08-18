import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "./Navbar"
import axios from "axios";
import {
    FaRegClock, FaMapMarkerAlt, FaDollarSign, FaBriefcase,
    FaUsers, FaCalendarAlt
} from "react-icons/fa";
import "../CSS/job.css";
import comlogo from "../company.png";

const Job = () => {
    const userEmail = localStorage.getItem('userEmail');
    const navigate = useNavigate();
    const { id } = useParams();
    const [jobDetails, setJobDetails] = useState(null);
    const [recommendedJobs, setRecommendedJobs] = useState([]);
    const [companyDetails, setCompanyDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await axios.get(`https://hirebackend-1.onrender.com/api/jobs/${id}`);
                setJobDetails(response.data);

                if (response.data.postedBy) {
                    const companyResponse = await axios.get(`https://hirebackend-1.onrender.com/api/companies/${response.data.postedBy}`);
                    setCompanyDetails(companyResponse.data);
                }
            } catch (error) {
                setError("Failed to fetch job details.");
            } finally {
                setLoading(false);
            }
        };

        const fetchRecommendedJobs = async () => {
            try {
                const response = await axios.get(`https://hirebackend-1.onrender.com/api/job`);
                const jobsWithCompanyLogos = await Promise.all(response.data.map(async (job) => {
                    try {
                        if (job.type === "native") {
                            const companyResponse = await axios.get(`https://hirebackend-1.onrender.com/api/companies/${job.postedBy}`);
                            return {
                                ...job,
                                comlogo: companyResponse.data.logo
                            };
                        } else {
                            return { ...job };
                        }
                    } catch (err) {
                        return job; 
                    }
                }));
                
                const validJobs = jobsWithCompanyLogos.filter(job => {
                    return calculateTimeLeft(job.applicationDeadline) !== "00:00:00";
                });

                const randomJobs = validJobs.sort(() => 0.5 - Math.random()).slice(0, 5);
                setRecommendedJobs(randomJobs);
            } catch (error) {
                setError("Failed to fetch recommended jobs.");
            }
        };

        fetchJobDetails();
        fetchRecommendedJobs();
    }, [id]);

    const calculateTimeLeft = (deadline) => {
        const now = new Date();
        const deadlineDate = new Date(deadline);
        const timeLeft = deadlineDate - now;

        if (timeLeft <= 0) return "00:00:00";
        const days = Math.floor((timeLeft / (1000 * 60 * 60 * 24)));
        const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
        const seconds = Math.floor((timeLeft / 1000) % 60);

        return `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const renderJobDetails = () => {
        if (jobDetails.type === "external") {
            return (
                <>
                    {jobDetails.title && <h1 className="job-title">{jobDetails.title}</h1>}
                    {  <img src={jobDetails.comlogo || comlogo} alt="Company Logo" className="company-logo" />}
                    {jobDetails.employmentType && (
                        <div className="job-detail-section">
                            <h2><FaBriefcase /> Job Type</h2>
                            <p>{jobDetails.employmentType}</p>
                        </div>
                    )}
                    {jobDetails.experienceLevel && (
                        <div className="job-detail-section">
                            <h2><FaUsers /> Experience</h2>
                            <p>{jobDetails.experienceLevel}</p>
                        </div>
                    )}
                    {jobDetails.workLocation && (
                        <div className="job-detail-section">
                            <h2><FaMapMarkerAlt /> Job Location</h2>
                            <p>{jobDetails.workLocation}</p>
                        </div>
                    )}
                    {jobDetails.salaryRange && (
                        <div className="job-detail-section">
                            <h2><FaDollarSign /> Salary</h2>
                            <p>{jobDetails.salaryRange.min} - {jobDetails.salaryRange.max}</p>
                        </div>
                    )}
                    {jobDetails.shift && jobDetails.shift.length > 0 && (
                        <div className="job-detail-section">
                            <h2><FaRegClock /> Work Details</h2>
                            <p>{jobDetails.shift.join(", ")}</p>
                        </div>
                    )}
                    {jobDetails.applicationDeadline && (
                        <div className="job-detail-section">
                            <h2><FaCalendarAlt /> Application Deadline</h2>
                            <p>{formatDate(jobDetails.applicationDeadline)}</p>
                        </div>
                    )}
                    {jobDetails.description && (
                        <div className="job-detail-section">
                            <h2>Job Description</h2>
                            <p>{jobDetails.description}</p>
                        </div>
                    )}
                </>
            );
        }

        return (
            <>

                <h1 className="job-title">{jobDetails.title}</h1>
                <img src={companyDetails.logo || comlogo} alt={`${companyDetails.name} logo`} className="company-logo" />
                <div className="job-detail-section">
                    <h2><FaBriefcase /> Job Type</h2>
                    <p>{jobDetails.employmentType}</p>
                </div>
                <div className="job-detail-section">
                    <h2><FaUsers /> Experience</h2>
                    <p>{jobDetails.experienceLevel}</p>
                </div>
                <div className="job-detail-section">
                    <h2><FaMapMarkerAlt /> Job Location</h2>
                    <p>{jobDetails.workLocation}</p>
                </div>
                <div className="job-detail-section">
                    <h2><FaDollarSign /> Salary</h2>
                    <p>{jobDetails.salaryRange.min} - {jobDetails.salaryRange.max}</p>
                </div>
                <div className="job-detail-section">
                    <h2><FaRegClock /> Work Details</h2>
                    <p>{jobDetails.shift ? jobDetails.shift.join(", ") : "N/A"}</p>
                </div>
                <div className="job-detail-section">
                    <h2><FaCalendarAlt /> Application Deadline</h2>
                    <p>{formatDate(jobDetails.applicationDeadline)}</p>
                </div>
                <div className="job-detail-section">
                    <h2>Job Description</h2>
                    <p>{jobDetails.description}</p>
                </div>
            </>
        );
    };

    return (
        <><Navbar /><div className="job-page">
            <div className="job-container">
                <div className="job-section">
                    {renderJobDetails()}
                    <button
                        className="apply-button"
                        onClick={() => {
                            if (jobDetails.type === "external") {
                                window.location.href = jobDetails.link;
                            } else {
                                navigate("/application", {
                                    state: { jobId: jobDetails._id, emailcurrent: userEmail },
                                });
                            }
                        }}
                    >
                        Apply Now
                    </button>
                </div>
                <div className="recommendation-section">
                    <h2>Recommended Jobs</h2>
                    <div className="recommended-job-grid">
                        {recommendedJobs.map((job, index) => (
                            <div key={index} className="recommended-job-card">
                                <img src={job.comlogo || comlogo} alt={`${job.title} logo`} className="job-logo" />
                                <div>
                                    <h3>{job.title}</h3>
                                    <p><FaRegClock /> Time Left: {calculateTimeLeft(job.applicationDeadline)}</p>
                                    <button
                                        className="view-button"
                                        onClick={() => navigate(`/job/${job._id}`)}
                                    >
                                        View
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>


            </div>
        </div></>
    );
};

export default Job;