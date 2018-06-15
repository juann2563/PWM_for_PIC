function pwm(){
	var tmrx = [1, 4, 16];
	var carga_timer = [0, 0 ,0];
	var max_res = [0, 0, 0]; //almacena los valores de resolucion para seleccionar la mayor
	var max_freq = [0, 0, 0]; // almacena los valores de frecuencia para seleccionar el mayor
	var osc_frequency = $('#osc-frequency').val(); // get oscilator frequency
	var scale_frequency = $("#scale-osc option:selected").text();
	var pwm_frequency = $('#pwm-frequency').val(); // get pwm frequency
	var scale_pwm = $('#scale-pwm option:selected').text();
	var max_duty = [0, 0 ,0];
	// se comprueba la escala en que son ingresados los datos
	// y se pasan a MHz para trabajar todo en MHz
	if(scale_frequency == "KHz"){
		osc_frequency = osc_frequency*1000;
	}
	if(scale_frequency == "MHz"){
		osc_frequency = osc_frequency*1000000;
	}
	if(scale_pwm == "KHz"){
		pwm_frequency = pwm_frequency*1000;
		//alert(pwm_frequency);
	}
	if(scale_pwm == "MHz"){
		pwm_frequency = pwm_frequency*1000000;
	}
		
	// calcular la resolucion
	// calcular la resolucion máxima
	//var n = Math.max.apply(null, max_res);
	//alert(n);
	var freq_min =  osc_frequency/(256*16*4);
	var freq_max = osc_frequency/(8);
	if(freq_min > pwm_frequency){
		Materialize.toast("No se puede generar la frecuencia solicitada",3000);
	
	}
	else if(pwm_frequency > freq_max){
		Materialize.toast("No se puede generar la frecuencia solicitada",3000);
	}
	else{
		var PRx = 0;
		for(var i=0; i<3; i++){
			PRx = (osc_frequency/(pwm_frequency*tmrx[i]*4))-1;
			carga_timer[i] = PRx;
			if(PRx > 255){
				max_freq[i] = 0;
				//alert(max_freq[i]);
				carga_timer[i] = 0;
			}
			else{
				max_res[i] = Math.log10(osc_frequency/(pwm_frequency*tmrx[i]))/Math.log10(2);
				
				if(max_res[i]>10){
					max_res[i]=0;
				}
				else{
					var pwm = osc_frequency/((PRx+1)*tmrx[i]*4);
					max_freq[i] = pwm;
					max_duty[i] = 2*Math.pow(2,max_res[i]);

					//alert("val: " + max_res[i] + " - pos: " +i);
				}
				
			}
			
		}
		if(max_res[0]>max_res[1] && max_res[0]>max_res[2]){
			$('#pwm-output').html(""+ max_freq[0]);
			$("#prescaler").html("" + tmrx[0]);
			$("#carga-timer").html("" + carga_timer[0]);
			$("#resolution").html("" + max_res[0].toFixed(2));
			$("#max-duty").html("" + max_duty[0].toFixed(2));
			//alert("pos1");
		}
		else if(max_res[1]>max_res[0] && max_res[1]>max_res[2]){
			$('#pwm-output').html(""+ max_freq[1]);
			$("#prescaler").html("" + tmrx[1] );
			$("#carga-timer").html("" + carga_timer[1]);
			$("#resolution").html("" + max_res[1].toFixed(2));
			$("#max-duty").html("" + max_duty[1].toFixed(2));
		}
		else{
			$('#pwm-output').html(""+ max_freq[2]);
			$("#prescaler").html("" + tmrx[2] );
			$("#carga-timer").html("" + carga_timer[2]);
			$("#resolution").html("" + max_res[2].toFixed(2));
			$("#max-duty").html("" + max_duty[2].toFixed(2));
		}
	}
	
}
