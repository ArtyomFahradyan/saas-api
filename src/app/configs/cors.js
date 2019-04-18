
const corsOptions = {
    development: {
        origin: [ /localhost:4200/, /localhost:4201/ ],
        credentials: true,
        allowedHeaders: [
            'Content-Type',
            'Authorization'
        ]
    },
    production: {
        origin: [ /saastracked.herokuapp.com/, /saastracked-admin.herokuapp.com/ ],
        credentials: true,
        allowedHeaders: [
            'Content-Type',
            'Authorization'
        ]
    }
};

export default corsOptions[process.env.NODE_ENV || 'development'];
