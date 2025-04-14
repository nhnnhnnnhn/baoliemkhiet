const controllerHandler = require("../utils/controllerHandler");
const service = require("../services/report.service");

// Create a new report
module.exports.createReport = async (req, res) => {
    const { reportedBy, articleId, commentId, reason } = req.body;

    if (!reportedBy || !reason) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    if(!articleId && !commentId) {
        return res.status(400).json({ message: "Either articleId or commentId is required" });
    }

    if (commentId && articleId) {
        return res.status(400).json({ message: "Cannot report both article and comment" });
    }

    const report = await service.createReport(reportedBy, articleId, commentId, reason);

    return res.status(201).json(report);
};

// Get all reports
module.exports.getAllReports = async (req, res) => {
    const reports = await service.getAllReports();

    return res.status(200).json(reports);
};

// Get report by ID
module.exports.getReportById = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: "Missing report ID" });
    }

    const report = await service.getReportById(id);

    if (!report) {
        return res.status(404).json({ message: "Report not found" });
    }

    return res.status(200).json(report);
};

// Get report by article ID
module.exports.getReportByArticleId = async (req, res) => {
    const articleId = parseInt(req.params.articleId);
    if (!articleId || isNaN(articleId)) {
        return res.status(400).json({ message: "Missing article ID" });
    }

    const reports = await service.getReportByArticleId(articleId);

    if (!reports || reports.length === 0) {
        return res.status(404).json({ message: "No reports found for this article" });
    }

    return res.status(200).json(reports);
};

// Get report by comment ID
module.exports.getReportByCommentId = async (req, res) => {
    const commentId = parseInt(req.params.commentId);

    if (!commentId || isNaN(commentId)) {
        return res.status(400).json({ message: "Missing comment ID" });
    }

    const reports = await service.getReportByCommentId(commentId);

    if (!reports || reports.length === 0) {
        return res.status(404).json({ message: "No reports found for this comment" });
    }

    return res.status(200).json(reports);
};

// Edit a report
module.exports.editReport = async (req, res) => {
    const id = parseInt(req.params.id);
    const { reason } = req.body;

    if (!id || !reason || isNaN(id)) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const report = await service.editReport(id, reason);

    if (!report) {
        return res.status(404).json({ message: "Report not found" });
    }

    return res.status(200).json(report);
};

// Delete a report
module.exports.deleteReport = async (req, res) => {
    const id = parseInt(req.params.id);

    if (!id || isNaN(id)) {
        return res.status(400).json({ message: "Missing report ID" });
    }

    const report = await service.deleteReport(id);

    if (!report) {
        return res.status(404).json({ message: "Report not found" });
    }

    return res.status(200).json({ message: "Report deleted successfully" });
};

// Delete multiple reports
module.exports.deleteMultipleReports = async (req, res) => {
    const { reportIds } = req.body;

    console.log(req.body);

    if (!reportIds || !Array.isArray(reportIds)) {
        return res.status(400).json({ message: "Missing report IDs" });
    }

    const deletedReports = await service.deleteMultipleReports(reportIds);

    if (!deletedReports) {
        return res.status(404).json({ message: "No reports found" });
    }

    return res.status(200).json({ message: "Reports deleted successfully" });
};