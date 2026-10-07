import React, { useState, useCallback } from 'react';

import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
  Dimensions,
  TouchableOpacity,
  Modal,
  ScrollView
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const CONTAINER_PADDING = 16;
const INNER_PADDING = 12;

// Calculamos el ancho exacto para 2 columnas simétricas dentro del contenedor
const GRID_WIDTH = width - (CONTAINER_PADDING * 2);
const CARD_WIDTH = (GRID_WIDTH - (INNER_PADDING * 2) - 12) / 2;

const IP = process.env.EXPO_PUBLIC_API_IP;

function RenderTarjeta({ item, index, onPress }) {

  const imageUri = item.imageUrl || item.image || item.uri;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress(item)}
      style={styles.cardContainer}
    >
      {imageUri ? (
        <Image
          source={
            typeof imageUri === 'string'
              ? { uri: imageUri }
              : imageUri
          }
          style={styles.cardImage}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.noImageContainer}>
          <Text style={styles.noImageText}>imagen</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function ProfileHeader({ nombreUsuario = "Nombre del usuario" }) {

  return (
    <View style={styles.headerContainer}>

      <View style={styles.avatarContainer}>

        <Image
          source={require('../assets/Perfil2.png')}
          style={styles.avatarImage}
        />

      </View>

      <Text style={styles.userName}>
        {nombreUsuario}
      </Text>

    </View>
  );
}

export default function ProfileScreen() {

  const [tarjetas, setTarjetas] = useState([]);

  const [cargandoInicial, setCargandoInicial] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  // Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState(null);

  const obtenerImagenes = async (esRecarga = false) => {

    if (esRecarga) {
      setRefreshing(true);
    } else {
      setCargandoInicial(true);
    }

    try {

      const API_URL = `https://${IP}/api/images/`;

      const response = await fetch(API_URL);

      const data = await response.json();

      if (response.ok && data.mensaje) {

        const tarjetasFormateadas = data.mensaje.map((item) => {

          const filename = item.path
            ? item.path.split(/[/**\\**]/).pop()
            : '';

          const urlFinal = filename
            ? `http://${IP}/uploads/images/${filename}`
            : null;

          return {
            ...item,
            imageUrl: urlFinal
          };

        });

        setTarjetas(tarjetasFormateadas);

      } else {

        console.error(
          "Error al obtener imágenes:",
          data.error
        );

        setTarjetas([]);

      }

    } catch (error) {

      console.error(
        "ERROR FETCH:",
        error
      );

    } finally {

      setCargandoInicial(false);
      setRefreshing(false);

    }
  };

  useFocusEffect(
    useCallback(() => {

      obtenerImagenes();

    }, [])
  );

  const onRefresh = () => {

    obtenerImagenes(true);

  };

  const abrirTarjeta = (item) => {

    setTarjetaSeleccionada(item);
    setModalVisible(true);

  };

  const obtenerCategorias = (item) => {

    if (!item?.categories && !item?.categoria) {
      return [];
    }

    const cat = item.categories || item.categoria;

    if (Array.isArray(cat)) {
      return cat;
    }

    try {

      return JSON.parse(cat);

    } catch {

      return [cat];

    }

  };


  const imageUriModal =
    tarjetaSeleccionada?.imageUrl ||
    tarjetaSeleccionada?.image ||
    tarjetaSeleccionada?.uri;

  const listaCategorias =
    tarjetaSeleccionada
      ? obtenerCategorias(tarjetaSeleccionada)
      : [];

  return (

    <View style={styles.screenContainer}>

      {cargandoInicial ? (

        <View
          style={[
            styles.screenContainer,
            styles.center
          ]}
        >

          <ActivityIndicator
            size="large"
            color="#2C3240"
          />

          <Text style={styles.loadingText}>
            Cargando perfil...
          </Text>

        </View>

      ) : (

        <FlatList

          data={tarjetas}

          keyExtractor={(item, index) =>
            item.id?.toString() ||
            item._id?.toString() ||
            index.toString()
          }

          // Perfil arriba de las imágenes
          ListHeaderComponent={
            <ProfileHeader />
          }

          renderItem={({ item, index }) => (

            <RenderTarjeta
              item={item}
              index={index}
              onPress={abrirTarjeta}
            />

          )}

          numColumns={2}

          columnWrapperStyle={
            styles.columnWrapper
          }

          contentContainerStyle={
            styles.gridContainer
          }

          refreshControl={

            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#2A327D']}
            />

          }

          ListEmptyComponent={

            <View style={styles.emptyContainer}>

              <Text style={styles.emptyText}>
                No hay imágenes en el perfil.
              </Text>

            </View>

          }

        />

      )}

      <Modal

        visible={modalVisible}

        transparent={true}

        animationType="fade"

        onRequestClose={() =>
          setModalVisible(false)
        }

      >

        <View style={styles.modalBackground}>

          <TouchableOpacity
            onPress={() =>
              setModalVisible(false)
            }
            style={styles.closeButton}
          >

            <Text style={styles.closeButtonText}>
              ✕ Cerrar
            </Text>

          </TouchableOpacity>


          {tarjetaSeleccionada && (

            <ScrollView

              contentContainerStyle={
                styles.modalScrollContent
              }

              showsVerticalScrollIndicator={false}

            >

              {/* Imagen principal */}

              {imageUriModal && (

                <Image

                  source={{
                    uri: imageUriModal
                  }}

                  style={styles.fullImage}

                  resizeMode="contain"

                />

              )}


              {/* Información */}

              <View
                style={styles.modalInfoContainer}
              >

                {/* Nombre */}

                <Text
                  style={styles.modalTitle}
                >

                  {
                    tarjetaSeleccionada.name ||
                    tarjetaSeleccionada.nombre ||
                    'Sin título'
                  }

                </Text>


                {/* Categorías */}

                {listaCategorias.length > 0 && (

                  <View
                    style={styles.categoriesWrapper}
                  >

                    {listaCategorias.map(
                      (cat, idx) => (

                        <View
                          key={idx}
                          style={styles.categoryBadge}
                        >

                          <Text
                            style={
                              styles.categoryBadgeText
                            }
                          >

                            {cat}

                          </Text>

                        </View>

                      )
                    )}

                  </View>

                )}


                {/* Descripción */}

                <Text
                  style={styles.modalDescription}
                >

                  {
                    tarjetaSeleccionada.description ||
                    tarjetaSeleccionada.descripcion ||
                    'Sin descripción disponible.'
                  }

                </Text>

              </View>

            </ScrollView>

          )}

        </View>

      </Modal>

    </View>

  );
}

const styles = StyleSheet.create({

  screenContainer: {

    flex: 1,

    backgroundColor: '#ADADAD',

  },

  center: {

    justifyContent: 'center',

    alignItems: 'center',

  },

  loadingText: {

    color: '#000',

    marginTop: 10,

    fontSize: 16,

  },

  headerContainer: {

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 24,

    paddingTop: 20,

    paddingBottom: 15,

  },

  avatarContainer: {

    width: 90,

    height: 90,

    borderRadius: 45,

    borderWidth: 4,

    borderColor: '#ADADAD',

    overflow: 'hidden',

    backgroundColor: '#FFF',

    justifyContent: 'center',

    alignItems: 'center',

  },

  avatarImage: {

    width: '100%',

    height: '100%',

  },

  userName: {

    fontSize: 18,

    fontWeight: 'bold',

    color: '#000',

    marginLeft: 20,

  },

  gridContainer: {

    paddingHorizontal: CONTAINER_PADDING,

    paddingBottom: 100,

  },

  columnWrapper: {

    justifyContent: 'space-between',

    backgroundColor: '#959CA8',

    padding: INNER_PADDING,

  },

  cardContainer: {

    width: CARD_WIDTH,

    height: CARD_WIDTH * 1.1,

    backgroundColor: '#CBC2D8',

    borderRadius: 8,

    overflow: 'hidden',

  },

  cardImage: {

    width: '100%',

    height: '100%',

    marginBottom: 15
  },

  noImageContainer: {

    flex: 1,

    justifyContent: 'center',

    alignItems: 'center',

  },

  noImageText: {

    color: '#333',

    fontSize: 14,

  },

  emptyContainer: {

    padding: 30,

    alignItems: 'center',

  },

  emptyText: {

    color: '#333',

    fontSize: 16,

  },

  modalBackground: {

    flex: 1,

    backgroundColor: '#FFFFFF',

  },

  modalScrollContent: {

    alignItems: 'center',

    justifyContent: 'center',

    paddingVertical: 40,

    paddingHorizontal: 20,

    marginTop: 100,

  },

  closeButton: {

    position: 'absolute',

    top: 40,

    right: 20,

    zIndex: 10,

    padding: 10,

    backgroundColor: 'rgba(0, 0, 0, 0.1)',

    borderRadius: 20,

  },

  closeButtonText: {

    color: '#000000',

    fontWeight: 'bold',

    fontSize: 18,

  },

  fullImage: {

    width: width * 0.85,

    height: 350,

    borderRadius: 12,

  },

  modalInfoContainer: {

    width: width * 0.85,

    marginTop: 20,

    alignItems: 'flex-start',

  },

  modalTitle: {

    color: '#000000',

    fontSize: 22,

    fontWeight: 'bold',

    marginBottom: 10,

  },

  categoriesWrapper: {

    flexDirection: 'row',

    flexWrap: 'wrap',

    marginBottom: 12,

  },

  categoryBadge: {

    backgroundColor: '#E0E0E0',

    paddingHorizontal: 10,

    paddingVertical: 4,

    borderRadius: 6,

    marginRight: 6,

    marginBottom: 6,

    borderWidth: 1,

    borderColor: '#CCC',

  },

  categoryBadgeText: {

    color: '#000000',

    fontSize: 13,

    fontWeight: '600',

  },

  modalDescription: {

    color: '#333333',

    fontSize: 15,

    lineHeight: 22,

  },

});

