import admin from "firebase-admin";


const serviceAccount = {
    "type": "service_account",
    "project_id": "laos-toyota-service",
    "private_key_id": "8c7a3d7da6bffe57ba66a3804a916bff843bfb10",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC/hR5/MEJEzWhT\nl1Ni50HdhTQYAAO4Gt6r5oSNrw/yDZKGy1+U7xReiRnKw5iq9vnCE/ALWgHivAC/\niYFi+7kezFdndZLRNhnqo2A1hIh0Z0L82P8kYu5rlAWhNwO98Lt3gq+ENw9c5ghW\nPvZ970FWKNS+xSvo+w6sSv1HblBdQ2KI/GjIZINIMKdbz8fsbaPrK3IwEKiNRIfn\nOZCnVuZtFhiJcS1Joq20YFxRqBfaBAglrngMDS9rq6BK7EpWQPrnk25aaA8oT6n7\nGWV2n8r1URyxs9MsWLqef5U9f0H0254RVmddgTbSeh3VOqMdKMLHopD0PPp8wN7y\nGm/eNHlVAgMBAAECggEAKxHihRti98qSyOOp4L7diNXtHG2aaIOAanudeShyp05m\nkpI3ZUyr0cO2zWrV0TLYAY2OyNq9vFHnwCtJ8ermm3a8PDvMX+ixBNunZfmvXzAe\nuDKLlFD8Sayg5Hu1B3jVC+ATnSHtvkhL/StNLw6IbLojd+BrCsq05sm5cmAsSgCa\nZI99T0/R+d8aA/OtYZnfAuQkUNAlabE0W9I2ze0UFJzGOtctVsp1TjvCshwYur7V\nt9/QwU5pAR4SgQ54m4Yt2EJhLlztrGVolpnvlD+6/kwR/cmiEFB4AR2xY23F+BEn\nL3z3o5qKLJwSv5IAHUxbHAGly+nz3t3PBSNWU0dcEQKBgQD5QcCkt2I1lOpCoASi\nYpmxumNmzthVjKD6JaoX5e04nZTVUZQPOReV5m56ZIqKedo5hJMkazUgIdJ8Vi1y\nFndP56TNtcdp3uKraoo9cqQbpf5miGHXcN4OFO6uP7OLnSGmI2FX7E20UVu4+ChT\n0lbyy/ysRRHQ3MQLUW4el821hQKBgQDEs4FwMzDBA83hMP4iV4Qun8WGzkf3U+Gn\ndEf0LsMKvWdgK+/JbTgKxzVlTOZ5upSdTv6y9LB394b2QzsxKkQXphHw+D5iXTi2\nL0eGS6MCB0+vKNYJBWihQ05ktRMMHyjf2SVH6zQPj8mcO0bH1VFlHi3S57zUSB+1\nBwFX19XVkQKBgB91/SrNOsgok6j1KaCVcXDNZd6EHSovJeJs/pslmlubCD4knduO\nCTwSab9pEVOJLdI0uZ3PKlVz721iMzpDO6wKQPL2DsV+LH4WZHx9C9mxifrHHBJl\nXKHKYpX71F2655RgwtimKuinnDwslmp+EhtzQ+E6lpUWSGhlTtDtuDlBAoGBALzC\ncgVk6nVfHDPtGwODrnI7modZ70/WLCbQ/LfEJCFrTwfIQgyvBee58XCr0kSgmzs2\nck7zZ2FIpTgvnl74620yTedLojossV6Lkny6msw4jexOKM9xZE3U1CbqaUPppwTh\nUdhpSoVge520eKEOAVUjF+BbyCaCrALBnTVaB3cxAoGBAOHyah7lf1+6Ud+2KLTI\nf6V7RwAaMeJdbN7DfAV2VQ1d6ryPFITl9xGTgpk1bSuAHP5B5JgkizP45zelt0Be\nyNh6skhO8O9Afslb/rp+JdmIWD5IYTJFyPr2TFq+s5q4b6E+rbpfzP4giFeMJbuo\n3ZGS/IiGtNNVE7LeZnE1H2rT\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-fbsvc@laos-toyota-service.iam.gserviceaccount.com",
    "client_id": "100467431431444435073",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40laos-toyota-service.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
}



const firebaseAdmin = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
export default firebaseAdmin;