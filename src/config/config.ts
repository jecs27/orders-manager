export default () => ({
  port: parseInt(process.env.PORT || '3000', 10),
  mongo: {
    uri: process.env.MONGODB_URI,
  },
  redis: {
    url: process.env.REDIS_URL,
  },
  kafka: {
    broker: process.env.KAFKA_BROKER,
    clientId: process.env.KAFKA_CLIENT_ID,
    topicOrdenesCreadas: process.env.KAFKA_TOPIC_ORDENES_CREADAS,
  },
});
  