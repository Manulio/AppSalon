<?php

function obtenerServicios() {

    try{

        //Importar Conexión
        require 'database.php';


        //Codigo SQL
        $sql = "SELECT * FROM servicios";

        $consulta = mysqli_query($db,$sql);

        //Array vacío
        $servicios=[];

        $i=0;

        //mostrar resultado
        while($row=mysqli_fetch_assoc($consulta)){

            $servicios[$i]['id']=$row['id'];
            $servicios[$i]['nombre']=$row['nombre'];
            $servicios[$i]['precio']=$row['precio'];
            $i++;
           
        }
        // echo "<pre>";
        // var_dump($servicios);
        // echo "</pre>";

        return $servicios;
     
    }catch(\Throwable $th){

    }

}

obtenerServicios();