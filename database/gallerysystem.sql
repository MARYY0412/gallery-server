CREATE DATABASE  IF NOT EXISTS `gallerysystem` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `gallerysystem`;
-- MySQL dump 10.13  Distrib 8.0.32, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: gallerysystem
-- ------------------------------------------------------
-- Server version	8.0.32

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `images`
--

DROP TABLE IF EXISTS `images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `images` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `user_id` int NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `date_added` varchar(45) NOT NULL,
  `AVGRating` decimal(3,2) DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `images_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=176 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `images`
--

LOCK TABLES `images` WRITE;
/*!40000 ALTER TABLE `images` DISABLE KEYS */;
INSERT INTO `images` VALUES (170,'633c4e54-a85a-4ba5-b4f7-b2ce0e633b80.jpg',103,NULL,'2023-06-01 23:18:54',NULL),(171,'703dba3e-c202-4576-ab7e-41e69814d6dc.jpg',103,NULL,'2023-06-01 23:18:54',NULL),(172,'797dc70b-6150-42aa-b525-327cce83a8c3.jpg',103,NULL,'2023-06-01 23:18:54',NULL),(173,'a83b1551-affe-4e14-aec8-5e025dc9bb97.jpg',102,NULL,'2023-06-01 23:19:24',NULL),(174,'feaab8fa-ef4e-4697-8042-d6f1168ed01f.jpg',102,NULL,'2023-06-01 23:19:24',NULL),(175,'66a23b49-bb5e-4470-b194-7e5cb04b97e7.jpg',102,NULL,'2023-06-01 23:19:24',NULL);
/*!40000 ALTER TABLE `images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `content` varchar(255) NOT NULL,
  `sender` int NOT NULL,
  `recipent` int NOT NULL,
  `date` varchar(45) NOT NULL,
  `theme` varchar(45) NOT NULL,
  `readed` tinyint NOT NULL,
  PRIMARY KEY (`ID`),
  KEY `sender_idx` (`sender`),
  KEY `recipent_idx` (`recipent`),
  CONSTRAINT `recipent` FOREIGN KEY (`recipent`) REFERENCES `users` (`ID`),
  CONSTRAINT `sender` FOREIGN KEY (`sender`) REFERENCES `users` (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `newsletter`
--

DROP TABLE IF EXISTS `newsletter`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `newsletter` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `email` varchar(45) NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `newsletter`
--

LOCK TABLES `newsletter` WRITE;
/*!40000 ALTER TABLE `newsletter` DISABLE KEYS */;
/*!40000 ALTER TABLE `newsletter` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ratingsofimages`
--

DROP TABLE IF EXISTS `ratingsofimages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ratingsofimages` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `imageId` int NOT NULL,
  `userId` int NOT NULL,
  `value` int NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ratingsofimages`
--

LOCK TABLES `ratingsofimages` WRITE;
/*!40000 ALTER TABLE `ratingsofimages` DISABLE KEYS */;
/*!40000 ALTER TABLE `ratingsofimages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `password` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT 'none',
  `date_of_birth` varchar(45) NOT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=105 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (102,'adminadmin','adminadmin@wp.pl','$2b$10$aHHAJfQzKcTjuDurLAvjIOTmfvM8FakfLU2lwhFM.hIBKxo01wGoW','758db0d9-1b67-46ab-bbd9-5f027361f52b.jpg','1998-06-10','admin'),(103,'useruser','useruser@wp.pl','$2b$10$IvSJ5JAB1mEdZw6YF6rivOkhimimRCJxe6Z.3.Xny7TZeDcC1u5w2','c887047e-5662-4713-a3f2-e2df9710e575.jpg','2023-05-30','user'),(104,'useruser1','useruser1@wp.pl','$2b$10$kCkF4RH51pD7KcfslY/DIOGvsQguCu/SbvSJwnYoEBvUI9kgPpzMC','bd60a481-3a70-4ee1-b53f-9d9cd1d7c3b4.jpg','2023-07-04','user');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-07-10 23:27:12
