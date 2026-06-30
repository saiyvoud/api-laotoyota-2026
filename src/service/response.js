export const SendCreate = (res, message, data) => {
    res.status(201).json({ success: true, message, data }); // 201 create 
}
export const SendSuccess = (res, message, data) => {
    res.status(200).json({ success: true, message, data });
}
export const SendError = (res, status, message, error) => {
    const errDetail = error instanceof Error
        ? { message: error.message, code: error.code }
        : error;
    res.status(status).json({ success: false, message, error: errDetail, data: {} });
}