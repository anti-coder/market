-- MySQL dump 10.13  Distrib 8.0.22, for Win64 (x86_64)
--
-- Host: localhost    Database: market
-- ------------------------------------------------------
-- Server version	8.0.22

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
-- Temporary view structure for view `report_ve`
--

DROP TABLE IF EXISTS `report_ve`;
/*!50001 DROP VIEW IF EXISTS `report_ve`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `report_ve` AS SELECT 
 1 AS `id`,
 1 AS `amount`,
 1 AS `by_amount`,
 1 AS `remainder`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `report_ven`
--

DROP TABLE IF EXISTS `report_ven`;
/*!50001 DROP VIEW IF EXISTS `report_ven`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `report_ven` AS SELECT 
 1 AS `id`,
 1 AS `amount`,
 1 AS `by_amount`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `report_vend`
--

DROP TABLE IF EXISTS `report_vend`;
/*!50001 DROP VIEW IF EXISTS `report_vend`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `report_vend` AS SELECT 
 1 AS `id`,
 1 AS `amount`,
 1 AS `by_amount`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `report_store`
--

DROP TABLE IF EXISTS `report_store`;
/*!50001 DROP VIEW IF EXISTS `report_store`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `report_store` AS SELECT 
 1 AS `id`,
 1 AS `amount`,
 1 AS `by_amount`,
 1 AS `remainder`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `report_vendo`
--

DROP TABLE IF EXISTS `report_vendo`;
/*!50001 DROP VIEW IF EXISTS `report_vendo`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `report_vendo` AS SELECT 
 1 AS `id`,
 1 AS `amount`,
 1 AS `by_amount`,
 1 AS `remainder`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `report_s`
--

DROP TABLE IF EXISTS `report_s`;
/*!50001 DROP VIEW IF EXISTS `report_s`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `report_s` AS SELECT 
 1 AS `id`,
 1 AS `amount`,
 1 AS `by_amount`,
 1 AS `remainder`*/;
SET character_set_client = @saved_cs_client;

--
-- Temporary view structure for view `report_vendor`
--

DROP TABLE IF EXISTS `report_vendor`;
/*!50001 DROP VIEW IF EXISTS `report_vendor`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `report_vendor` AS SELECT 
 1 AS `id`,
 1 AS `amount`,
 1 AS `by_amount`,
 1 AS `remainder`*/;
SET character_set_client = @saved_cs_client;

--
-- Final view structure for view `report_ve`
--

/*!50001 DROP VIEW IF EXISTS `report_ve`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`jul`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `report_ve` AS select `store`.`goods_id` AS `id`,`store`.`amount` AS `amount`,`purchases`.`by_amount` AS `by_amount`,(`store`.`amount` - `purchases`.`by_amount`) AS `remainder` from (`store` left join `purchases` on((`store`.`goods_id` = `purchases`.`goods_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `report_ven`
--

/*!50001 DROP VIEW IF EXISTS `report_ven`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`jul`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `report_ven` AS select `store`.`goods_id` AS `id`,`store`.`amount` AS `amount`,`purchases`.`by_amount` AS `by_amount` from (`store` left join `purchases` on((`store`.`goods_id` = `purchases`.`goods_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `report_vend`
--

/*!50001 DROP VIEW IF EXISTS `report_vend`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`jul`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `report_vend` AS select `store`.`goods_id` AS `id`,`store`.`amount` AS `amount`,`purchases`.`by_amount` AS `by_amount` from (`store` left join `purchases` on((`store`.`goods_id` = `purchases`.`goods_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `report_store`
--

/*!50001 DROP VIEW IF EXISTS `report_store`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`jul`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `report_store` AS select `store`.`goods_id` AS `id`,`store`.`amount` AS `amount`,`purchases`.`by_amount` AS `by_amount`,(`store`.`amount` - `purchases`.`by_amount`) AS `remainder` from (`store` left join `purchases` on((`store`.`goods_id` = `purchases`.`goods_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `report_vendo`
--

/*!50001 DROP VIEW IF EXISTS `report_vendo`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`jul`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `report_vendo` AS select `store`.`goods_id` AS `id`,`store`.`amount` AS `amount`,`purchases`.`by_amount` AS `by_amount`,(`store`.`amount` - `purchases`.`by_amount`) AS `remainder` from (`store` left join `purchases` on((`store`.`goods_id` = `purchases`.`goods_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `report_s`
--

/*!50001 DROP VIEW IF EXISTS `report_s`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`jul`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `report_s` AS select `store`.`goods_id` AS `id`,`store`.`amount` AS `amount`,`purchases`.`by_amount` AS `by_amount`,(`store`.`amount` - `purchases`.`by_amount`) AS `remainder` from (`store` left join `purchases` on((`store`.`goods_id` = `purchases`.`goods_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `report_vendor`
--

/*!50001 DROP VIEW IF EXISTS `report_vendor`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8 */;
/*!50001 SET character_set_results     = utf8 */;
/*!50001 SET collation_connection      = utf8_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`jul`@`%` SQL SECURITY DEFINER */
/*!50001 VIEW `report_vendor` AS select `store`.`goods_id` AS `id`,`store`.`amount` AS `amount`,`purchases`.`by_amount` AS `by_amount`,(`store`.`amount` - `purchases`.`by_amount`) AS `remainder` from (`store` left join `purchases` on((`store`.`goods_id` = `purchases`.`goods_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Dumping routines for database 'market'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-11-05 23:31:32
