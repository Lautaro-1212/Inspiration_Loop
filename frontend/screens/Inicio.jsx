import React from 'react';  
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen({ publicaciones }) {
  const datosFicticios = [
    { id: '1', nombre: 'Imagen1', alto: 220 },
    { id: '2', nombre: 'Imagen2', alto: 300 },
    { id: '3', nombre: 'Imagen3', alto: 260 },
    { id: '4', nombre: 'Imagen4', alto: 200 },
    { id: '5', nombre: 'Imagen5', alto: 180 },
    { id: '6', nombre: 'Imagen6', alto: 240 },
  ];

  // Si recibes publicaciones reales usa esas, de lo contrario muestra los placeholders de prueba
  const listaAUsar = (publicaciones && publicaciones.length > 0) ? publicaciones : datosFicticios;

  const columnaIzquierda = listaAUsar.filter((_, index) => index % 2 === 0);
  const columnaDerecha = listaAUsar.filter((_, index) => index % 2 !== 0);

  const RenderTarjeta = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      {/* Caja blanca en lugar de <Image> */}
      <View style={[styles.placeholderBlanco, { height: item.alto || 200 }]} />
      <Text style={styles.titulo}>{item.nombre}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView 
  style={styles.container} 
  contentContainerStyle={styles.scrollContent}
  indicatorStyle="default" // Opciones: 'default', 'black', 'white' (principalmente para iOS y algunas capas de Android)
>
      <View style={styles.masonryContainer}>
        {/* Columna Izquierda */}
        <View style={styles.columna}>
          {columnaIzquierda.map((item, index) => (
            <RenderTarjeta key={item.id || index} item={item} />
          ))}
        </View>

        {/* Columna Derecha */}
        <View style={styles.columna}>
          {columnaDerecha.map((item, index) => (
            <RenderTarjeta key={item.id || index} item={item} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#737785', // Color de fondo gris como tu diseño
  },
  scrollContent: {
    padding: 15,
    paddingBottom: 100,
    
  },
  masonryContainer: {
    paddingTop:20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  columna: {
    width: '48%',
  },
  card: {
    
    marginBottom: 16,
  },
  placeholderBlanco: {
    width: '100%',
    backgroundColor: '#FFFFFF', // Recuadro blanco sólido
    borderRadius: 15,
  },
  titulo: {
    marginTop: 6,
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
});